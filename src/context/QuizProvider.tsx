import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react'
import type { QuizQuestion, QuizState, UserProgressData, UserStats, ProfileId } from '../types'
import { useAuth } from './AuthProvider'
import rawQuestions from '../data/domande_quiz.json'

/* -------------- Costanti -------------- */
const INITIAL_STATS: UserStats = {
    totalAnswered: 0,
    correctCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    level: 1,
    xp: 0,
    badges: [],
}

const LEITNER_INTERVALS = [
    10 * 60 * 1000,       // Box 0: 10 minuti
    1 * 60 * 60 * 1000,   // Box 1: 1 ora
    6 * 60 * 60 * 1000,   // Box 2: 6 ore
    24 * 60 * 60 * 1000,  // Box 3: 1 giorno
    3 * 24 * 60 * 60 * 1000, // Box 4: 3 giorni
    7 * 24 * 60 * 60 * 1000, // Box 5: 7 giorni
]

/* -------------- Context -------------- */
interface QuizContextType extends QuizState {
    answerQuestion: (questionId: number, selectedAnswer: string) => { isCorrect: boolean; score: number }
    resetProgress: () => void
    getQuestionsForStudy: (count?: number, profileId?: ProfileId | null) => QuizQuestion[]
    getMistakeQuestions: (count?: number) => QuizQuestion[]
    getQuestionsByCategory: (category: string) => QuizQuestion[]
    getCategories: (profileId?: ProfileId | null) => string[]
    getLeitnerStats: () => number[]
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function useQuiz() {
    const context = useContext(QuizContext)
    if (!context) {
        throw new Error('useQuiz deve essere usato dentro QuizProvider')
    }
    return context
}

/* -------------- Helpers -------------- */
function getSafe<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    } catch {
        return null
    }
}

function setSafe(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // localStorage pieno o non disponibile
    }
}

/* -------------- Provider -------------- */
export function QuizProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()

    // Carica domande dal JSON
    const questions = useMemo(() => rawQuestions as QuizQuestion[], [])

    const [userProgress, setUserProgress] = useState<Record<number, UserProgressData>>({})
    const [stats, setStats] = useState<UserStats>(INITIAL_STATS)
    const [loading, setLoading] = useState(true)

    // Carica dati salvati
    useEffect(() => {
        if (!user) return

        const savedProgress = getSafe<Record<number, UserProgressData>>(`ripam_progress_${user.id}`)
        const savedStats = getSafe<UserStats>(`ripam_stats_${user.id}`)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserProgress(savedProgress || {})
        setStats(savedStats || INITIAL_STATS)
        setLoading(false)
    }, [user])

    // Salva automaticamente quando cambiano
    useEffect(() => {
        if (!user || loading) return
        setSafe(`ripam_progress_${user.id}`, userProgress)
    }, [userProgress, user, loading])

    useEffect(() => {
        if (!user || loading) return
        setSafe(`ripam_stats_${user.id}`, stats)
    }, [stats, user, loading])

    /* -------------- Rispondi a una domanda -------------- */
    const answerQuestion = useCallback((questionId: number, selectedAnswer: string) => {
        const question = questions.find(q => q.id === questionId)
        if (!question) return { isCorrect: false, score: 0 }

        let isCorrect = false
        let score = 0

        if (question.questionType === 'situational' && question.answerScores) {
            score = question.answerScores[selectedAnswer] || 0
            isCorrect = score === 0.75
        } else {
            isCorrect = selectedAnswer === question.correctAnswer
            score = isCorrect ? 0.75 : -0.25
        }

        // Aggiorna stats
        setStats(prev => {
            const newStreak = isCorrect ? prev.currentStreak + 1 : 0
            const xpGain = isCorrect ? 10 : 1
            return {
                ...prev,
                totalAnswered: prev.totalAnswered + 1,
                correctCount: prev.correctCount + (isCorrect ? 1 : 0),
                currentStreak: newStreak,
                bestStreak: Math.max(prev.bestStreak, newStreak),
                xp: prev.xp + xpGain,
                level: Math.floor((prev.xp + xpGain) / 100) + 1,
            }
        })

        // Aggiorna progresso Leitner
        setUserProgress(prev => {
            const current = prev[questionId] || { box: 0, nextReview: 0, lastReviewed: 0, history: [] }
            const newHistory = [...current.history, isCorrect].slice(-5)

            let newBox: number
            if (isCorrect) {
                newBox = Math.min(current.box + 1, 5)
            } else {
                newBox = Math.max(current.box - 1, 0)
            }

            const interval = LEITNER_INTERVALS[newBox] || LEITNER_INTERVALS[0]

            return {
                ...prev,
                [questionId]: {
                    box: newBox,
                    nextReview: Date.now() + interval,
                    lastReviewed: Date.now(),
                    history: newHistory,
                },
            }
        })

        return { isCorrect, score }
    }, [questions])

    /* -------------- Domande per lo studio -------------- */
    const getQuestionsForStudy = useCallback((count = 10, profileId: ProfileId | null = null) => {
        const now = Date.now()

        // Filtra per profilo: domande comuni (null) + specifiche del profilo
        const filtered = questions.filter(q =>
            q.profileId === null || q.profileId === profileId
        )

        // Priorità: 1) non mai viste, 2) da ripassare (scadute), 3) per box più basso
        const scored = filtered.map(q => {
            const progress = userProgress[q.id]
            let priority = 0

            if (!progress) {
                priority = 100 // Mai vista = massima priorità
            } else if (progress.nextReview <= now) {
                priority = 50 + (5 - progress.box) * 5 // Da ripassare, box basso = più priorità
            } else {
                priority = 0 // Non ancora da ripassare
            }

            return { question: q, priority }
        })

        return scored
            .filter(s => s.priority > 0)
            .sort((a, b) => b.priority - a.priority)
            .slice(0, count)
            .map(s => s.question)
    }, [questions, userProgress])

    /* -------------- Domande sbagliate -------------- */
    const getMistakeQuestions = useCallback((count = 20) => {
        return questions.filter(q => {
            const progress = userProgress[q.id]
            if (!progress || progress.history.length === 0) return false
            return !progress.history[progress.history.length - 1]
        }).slice(0, count)
    }, [questions, userProgress])

    /* -------------- Per categoria -------------- */
    const getQuestionsByCategory = useCallback((category: string) => {
        return questions.filter(q => q.category === category)
    }, [questions])

    /* -------------- Categorie disponibili -------------- */
    const getCategories = useCallback((profileId: ProfileId | null = null) => {
        const filtered = questions.filter(q =>
            q.profileId === null || q.profileId === profileId
        )
        return [...new Set(filtered.map(q => q.category))]
    }, [questions])

    /* -------------- Stats Leitner -------------- */
    const getLeitnerStats = useCallback(() => {
        const boxCounts = [0, 0, 0, 0, 0, 0]
        Object.values(userProgress).forEach(p => {
            if (p.box >= 0 && p.box <= 5) {
                boxCounts[p.box]++
            }
        })
        return boxCounts
    }, [userProgress])

    /* -------------- Reset -------------- */
    const resetProgress = useCallback(() => {
        if (!user) return
        setUserProgress({})
        setStats(INITIAL_STATS)
        localStorage.removeItem(`ripam_progress_${user.id}`)
        localStorage.removeItem(`ripam_stats_${user.id}`)
    }, [user])

    /* -------------- Context value -------------- */
    const contextValue = useMemo<QuizContextType>(() => ({
        questions,
        userProgress,
        stats,
        loading,
        error: null,
        answerQuestion,
        resetProgress,
        getQuestionsForStudy,
        getMistakeQuestions,
        getQuestionsByCategory,
        getCategories,
        getLeitnerStats,
    }), [
        questions, userProgress, stats, loading,
        answerQuestion, resetProgress, getQuestionsForStudy,
        getMistakeQuestions, getQuestionsByCategory, getCategories, getLeitnerStats,
    ])

    return (
        <QuizContext.Provider value={contextValue}>
            {children}
        </QuizContext.Provider>
    )
}
