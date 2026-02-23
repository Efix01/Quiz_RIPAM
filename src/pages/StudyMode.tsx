import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { useQuiz } from '../context/QuizProvider'
import type { QuizQuestion } from '../types'
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Trophy,
    RotateCcw,
    Home,
    ChevronRight,
} from 'lucide-react'
import './StudyMode.css'

type Phase = 'select' | 'quiz' | 'result'

function StudyMode() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { getCategories, getQuestionsForStudy, answerQuestion } = useQuiz()

    const [phase, setPhase] = useState<Phase>('select')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [studyQuestions, setStudyQuestions] = useState<QuizQuestion[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showExplanation, setShowExplanation] = useState(false)
    const [sessionResults, setSessionResults] = useState<{ correct: number; total: number }>({
        correct: 0,
        total: 0,
    })

    const profileId = user?.selectedProfile ?? null
    const categories = useMemo(() => getCategories(profileId), [getCategories, profileId])
    const isPro = user?.subscriptionTier === 'pro';

    // Mock: prime 2 materie gratis, le altre Pro. (Nella realtà sarà un flag DB)
    const isCategoryFree = useCallback((idx: number) => {
        return idx < 2;
    }, []);

    const startStudy = useCallback((category: string | null) => {
        setSelectedCategory(category)
        const questions = getQuestionsForStudy(10, profileId)
        const filtered = category
            ? questions.filter(q => q.category === category)
            : questions

        if (filtered.length === 0) {
            // Se non ci sono domande da ripassare, prendi tutte per questa categoria
            const allQuestions = category
                ? getQuestionsForStudy(50, profileId).filter(q => q.category === category)
                : getQuestionsForStudy(50, profileId)
            setStudyQuestions(allQuestions.slice(0, 10))
        } else {
            setStudyQuestions(filtered.slice(0, 10))
        }

        setCurrentIndex(0)
        setSelectedAnswer(null)
        setShowExplanation(false)
        setSessionResults({ correct: 0, total: 0 })
        setPhase('quiz')
    }, [getQuestionsForStudy, profileId])

    const handleAnswer = useCallback((answer: string) => {
        if (showExplanation) return
        setSelectedAnswer(answer)
    }, [showExplanation])

    const confirmAnswer = useCallback(() => {
        if (!selectedAnswer || showExplanation) return

        const question = studyQuestions[currentIndex]
        const result = answerQuestion(question.id, selectedAnswer)

        setSessionResults(prev => ({
            correct: prev.correct + (result.isCorrect ? 1 : 0),
            total: prev.total + 1,
        }))

        setShowExplanation(true)
    }, [selectedAnswer, showExplanation, studyQuestions, currentIndex, answerQuestion])

    const nextQuestion = useCallback(() => {
        if (currentIndex < studyQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setShowExplanation(false)
        } else {
            setPhase('result')
        }
    }, [currentIndex, studyQuestions.length])

    const currentQuestion = studyQuestions[currentIndex]

    // === FASE SELEZIONE ===
    if (phase === 'select') {
        return (
            <div className="study-page">
                <button className="study-page__back" onClick={() => navigate('/')}>
                    <ArrowLeft size={16} />
                    Dashboard
                </button>

                <div className="study-categories">
                    <div className="study-categories__header">
                        <h2>Scegli una materia</h2>
                        <span className="study-categories__count">
                            {categories.length} materie
                        </span>
                    </div>

                    <div className="category-chips stagger-children">
                        <button
                            className={`category-chip ${!selectedCategory ? 'category-chip--active' : ''}`}
                            onClick={() => {
                                if (!isPro) {
                                    alert("Passa a PRO per studiare in modalità 'Tutte le materie' combinate!");
                                    return;
                                }
                                startStudy(null);
                            }}
                        >
                            📚 Tutte le materie {!isPro && '🔒'}
                        </button>

                        {categories.map((cat, idx) => {
                            const freeAccess = isCategoryFree(idx);
                            const locked = !isPro && !freeAccess;

                            return (
                                <button
                                    key={cat}
                                    className={`category-chip ${locked ? 'category-chip--locked' : ''}`}
                                    onClick={() => {
                                        if (locked) {
                                            alert(`Materiale avanzato. Passa a PRO per sbloccare la materia: ${cat}`);
                                            return;
                                        }
                                        startStudy(cat)
                                    }}
                                    style={locked ? { opacity: 0.6, cursor: 'not-allowed', borderColor: 'var(--border-color)', color: 'var(--color-text-muted)' } : {}}
                                >
                                    {cat} {locked && '🔒'}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }

    // === FASE RISULTATO ===
    if (phase === 'result') {
        const percentage = sessionResults.total > 0
            ? Math.round((sessionResults.correct / sessionResults.total) * 100)
            : 0

        const scoreClass = percentage >= 70 ? 'good' : percentage >= 50 ? 'medium' : 'bad'

        return (
            <div className="study-page">
                <div className="quiz-card">
                    <div className="study-result">
                        <Trophy
                            size={48}
                            color={`var(--color-accent-${scoreClass === 'good' ? 'green' : scoreClass === 'medium' ? 'amber' : 'red'})`}
                        />
                        <h2 style={{ marginTop: 'var(--space-md)' }}>Sessione completata!</h2>
                        <div className={`study-result__score study-result__score--${scoreClass}`}>
                            {percentage}%
                        </div>

                        <div className="study-result__stats">
                            <div className="study-result__stat">
                                <div className="study-result__stat-value text-green">
                                    {sessionResults.correct}
                                </div>
                                <div className="study-result__stat-label">Corrette</div>
                            </div>
                            <div className="study-result__stat">
                                <div className="study-result__stat-value text-red">
                                    {sessionResults.total - sessionResults.correct}
                                </div>
                                <div className="study-result__stat-label">Sbagliate</div>
                            </div>
                            <div className="study-result__stat">
                                <div className="study-result__stat-value">
                                    {sessionResults.total}
                                </div>
                                <div className="study-result__stat-label">Totale</div>
                            </div>
                        </div>

                        <div className="study-result__actions">
                            <button className="btn btn-secondary" onClick={() => navigate('/')}>
                                <Home size={16} />
                                Dashboard
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setPhase('select')
                                    setSelectedCategory(null)
                                }}
                            >
                                <RotateCcw size={16} />
                                Studia ancora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // === FASE QUIZ ===
    if (!currentQuestion) {
        return (
            <div className="study-page">
                <div className="study-empty">
                    <div className="study-empty__icon">
                        <CheckCircle size={32} />
                    </div>
                    <h2>Nessuna domanda da ripassare</h2>
                    <p>Hai completato tutte le domande per questa categoria! Torna più tardi.</p>
                    <button className="btn btn-primary" onClick={() => setPhase('select')}>
                        Scegli un'altra materia
                    </button>
                </div>
            </div>
        )
    }

    const isSituational = currentQuestion.questionType === 'situational'

    const getOptionClass = (key: string) => {
        if (!showExplanation) {
            return selectedAnswer === key ? 'quiz-option--selected' : ''
        }

        if (isSituational) {
            const score = currentQuestion.answerScores?.[key] || 0
            if (key === selectedAnswer) {
                return score === 0.75 ? 'quiz-option--correct quiz-option--disabled' : 'quiz-option--wrong quiz-option--disabled'
            }
            if (score === 0.75) return 'quiz-option--highlight quiz-option--disabled'
            return 'quiz-option--disabled'
        }

        if (key === currentQuestion.correctAnswer) return 'quiz-option--correct quiz-option--disabled'
        if (key === selectedAnswer) return 'quiz-option--wrong quiz-option--disabled'
        return 'quiz-option--disabled'
    }

    const isCorrect = isSituational
        ? (currentQuestion.answerScores?.[selectedAnswer || ''] || 0) === 0.75
        : selectedAnswer === currentQuestion.correctAnswer

    return (
        <div className="study-page">
            <button className="study-page__back" onClick={() => setPhase('select')}>
                <ArrowLeft size={16} />
                Torna alle materie
            </button>

            <div className="quiz-card">
                {/* Progress */}
                <div className="quiz-card__progress">
                    <span className="quiz-card__counter">
                        {currentIndex + 1} / {studyQuestions.length}
                    </span>
                    <span className="quiz-card__category">
                        {currentQuestion.category}
                    </span>
                </div>

                <div className="progress-bar" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div
                        className="progress-bar__fill"
                        style={{ width: `${((currentIndex + 1) / studyQuestions.length) * 100}%` }}
                    />
                </div>

                {/* Badge tipo domanda */}
                {isSituational && (
                    <span className="badge badge-gold" style={{ marginBottom: 'var(--space-md)' }}>
                        Domanda situazionale
                    </span>
                )}
                {currentQuestion.questionType === 'logic' && (
                    <span className="badge badge-blue" style={{ marginBottom: 'var(--space-md)' }}>
                        Ragionamento logico
                    </span>
                )}

                {/* Testo di Riferimento (Brano) */}
                {currentQuestion.referenceText && (
                    <div className="quiz-reference-text" style={{ padding: 'var(--space-md)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-md)', fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '4px solid var(--color-accent-gold)' }}>
                        {currentQuestion.referenceText}
                    </div>
                )}

                {/* Domanda */}
                <div className="quiz-card__question">
                    {currentQuestion.question}
                </div>

                {/* Opzioni */}
                <div className="quiz-options stagger-children">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <button
                            key={key}
                            className={`quiz-option ${getOptionClass(key)}`}
                            onClick={() => handleAnswer(key)}
                            disabled={showExplanation}
                        >
                            <span className="quiz-option__letter">{key}</span>
                            <span className="quiz-option__text">{value}</span>
                        </button>
                    ))}
                </div>

                {/* Spiegazione */}
                {showExplanation && (
                    <div className={`quiz-explanation ${isCorrect ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}>
                        <div className="quiz-explanation__title">
                            {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            {isCorrect ? 'Corretto!' : 'Sbagliato!'}
                        </div>
                        <div className="quiz-explanation__text">
                            {currentQuestion.explanation}
                        </div>
                        {isSituational && selectedAnswer && (
                            <div className="quiz-explanation__score">
                                Punteggio ottenuto: {currentQuestion.answerScores?.[selectedAnswer] || 0} / 0.75
                            </div>
                        )}
                        {currentQuestion.source && (
                            <div className="quiz-explanation__source">
                                📖 {currentQuestion.source}
                            </div>
                        )}
                    </div>
                )}

                {/* Azioni */}
                <div className="quiz-actions">
                    {!showExplanation ? (
                        <button
                            className="btn btn-primary"
                            onClick={confirmAnswer}
                            disabled={!selectedAnswer}
                        >
                            Conferma
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={nextQuestion}>
                            {currentIndex < studyQuestions.length - 1 ? 'Prossima' : 'Vedi risultato'}
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StudyMode
