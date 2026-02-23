import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuiz } from '../context/QuizProvider'
import { useAuth } from '../context/AuthProvider'
import { Timer, AlertTriangle, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight, BarChart3 } from 'lucide-react'
import './Simulation.css'

const TOTAL_QUESTIONS_PRO = 40;
const TIME_LIMIT_SECONDS_PRO = 60 * 60; // 60 minuti

const TOTAL_QUESTIONS_FREE = 20;
const TIME_LIMIT_SECONDS_FREE = 20 * 60; // 20 minuti

interface SimAnswer {
    questionId: number
    selected: string | null
    isCorrect: boolean
    score: number
}

type SimPhase = 'intro' | 'running' | 'timeout' | 'results'

export default function Simulation() {
    const { user } = useAuth()
    const { questions, loading } = useQuiz()

    const [phase, setPhase] = useState<SimPhase>('intro')
    const [simQuestions, setSimQuestions] = useState<typeof questions>([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<SimAnswer[]>([])
    const [selected, setSelected] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS_FREE)
    const [showFeedback, setShowFeedback] = useState(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const profile = user?.selectedProfile ?? null
    const isPro = user?.subscriptionTier === 'pro';
    const currentLimitQuestions = isPro ? TOTAL_QUESTIONS_PRO : TOTAL_QUESTIONS_FREE;
    const currentLimitTime = isPro ? TIME_LIMIT_SECONDS_PRO : TIME_LIMIT_SECONDS_FREE;

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const endSimulation = useCallback((timeout = false) => {
        stopTimer()
        setPhase(timeout ? 'timeout' : 'results')
    }, [stopTimer])

    // Start timer when running
    useEffect(() => {
        if (phase !== 'running') return
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endSimulation(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => stopTimer()
    }, [phase, endSimulation, stopTimer])

    const startSimulation = () => {
        // Random 40 questions filtered by profile
        const available = questions.filter(q =>
            q.profileId === null || q.profileId === profile
        )
        const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, currentLimitQuestions)
        setSimQuestions(shuffled)
        setAnswers([])
        setCurrentIdx(0)
        setSelected(null)
        setTimeLeft(currentLimitTime)
        setShowFeedback(false)
        setPhase('running')
    }

    const handleAnswer = (option: string) => {
        if (selected !== null || showFeedback) return
        setSelected(option)
        setShowFeedback(true)

        const q = simQuestions[currentIdx]
        const isCorrect = option === q.correctAnswer
        const score = isCorrect ? 0.75 : -0.25

        setAnswers(prev => [...prev, {
            questionId: q.id,
            selected: option,
            isCorrect,
            score,
        }])

        setTimeout(() => {
            if (currentIdx + 1 >= simQuestions.length) {
                endSimulation(false)
            } else {
                setCurrentIdx(prev => prev + 1)
                setSelected(null)
                setShowFeedback(false)
            }
        }, 900)
    }

    const skipQuestion = () => {
        const q = simQuestions[currentIdx]
        setAnswers(prev => [...prev, {
            questionId: q.id,
            selected: null,
            isCorrect: false,
            score: 0,
        }])
        if (currentIdx + 1 >= simQuestions.length) {
            endSimulation(false)
        } else {
            setCurrentIdx(prev => prev + 1)
            setSelected(null)
            setShowFeedback(false)
        }
    }

    // ---- Helpers ----
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const totalScore = answers.reduce((sum, a) => sum + a.score, 0)
    const correctCount = answers.filter(a => a.isCorrect).length
    const wrongCount = answers.filter(a => a.selected !== null && !a.isCorrect).length
    const skippedCount = answers.filter(a => a.selected === null).length

    const getGrade = (score: number) => {
        const max = currentLimitQuestions * 0.75
        const pct = (score / max) * 100
        if (pct >= 80) return { label: 'Eccellente', color: 'var(--color-accent-green)', icon: '🏆' }
        if (pct >= 65) return { label: 'Buono', color: 'var(--color-accent-blue)', icon: '✅' }
        if (pct >= 50) return { label: 'Sufficiente', color: 'var(--color-accent-amber)', icon: '📚' }
        return { label: 'Insufficiente', color: 'var(--color-accent-red)', icon: '📖' }
    }

    const timeUsed = currentLimitTime - timeLeft
    const isTimeCritical = timeLeft < 300 // ultimi 5 minuti

    if (loading) return <div className="loading-overlay">Caricamento domande…</div>

    // =========================================
    // INTRO SCREEN
    // =========================================
    if (phase === 'intro') {
        return (
            <div className="sim-intro animate-fade-in-up">
                <div className="sim-intro__icon">
                    <Timer size={40} />
                </div>
                <h1 className="sim-intro__title">Simulazione d'Esame</h1>
                <p className="sim-intro__subtitle">
                    Affronta la simulazione nelle stesse condizioni dell'esame reale.
                </p>

                <div className="sim-intro__rules stagger-children">
                    <div className="sim-rule">
                        <span className="sim-rule__num">{currentLimitQuestions}</span>
                        <span className="sim-rule__label">domande a risposta multipla</span>
                    </div>
                    <div className="sim-rule">
                        <span className="sim-rule__num">{currentLimitTime / 60}'</span>
                        <span className="sim-rule__label">di tempo massimo</span>
                    </div>
                    <div className="sim-rule">
                        <span className="sim-rule__num">+0.75</span>
                        <span className="sim-rule__label">risposta corretta</span>
                    </div>
                    <div className="sim-rule">
                        <span className="sim-rule__num">–0.25</span>
                        <span className="sim-rule__label">risposta errata</span>
                    </div>
                    <div className="sim-rule">
                        <span className="sim-rule__num">0</span>
                        <span className="sim-rule__label">risposta non data</span>
                    </div>
                </div>

                {!isPro && (
                    <div className="sim-paywall-notice" style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <span>🔒</span>
                        <p style={{ margin: 0 }}><strong>Modalità Free attiva.</strong> La simulazione è ridotta a 20 domande (20 min). Passa a PRO per sbloccare la simulazione completa reale (40 domande, 60 min).</p>
                    </div>
                )}

                <button className="btn btn-primary btn-lg sim-intro__cta" onClick={startSimulation}>
                    Inizia Simulazione
                    <ChevronRight size={20} />
                </button>
            </div>
        )
    }

    // =========================================
    // RUNNING — Quiz screen
    // =========================================
    if (phase === 'running') {
        const q = simQuestions[currentIdx]
        const progress = ((currentIdx) / simQuestions.length) * 100

        return (
            <div className="sim-running animate-fade-in">
                {/* Top bar */}
                <div className={`sim-topbar ${isTimeCritical ? 'sim-topbar--urgent' : ''}`}>
                    <div className="sim-progress-text">
                        <span className="sim-progress-text__current">{currentIdx + 1}</span>
                        <span className="sim-progress-text__sep"> / </span>
                        <span className="sim-progress-text__total">{simQuestions.length}</span>
                    </div>
                    <div className={`sim-timer ${isTimeCritical ? 'sim-timer--urgent' : ''}`}>
                        <Timer size={16} />
                        {formatTime(timeLeft)}
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={() => endSimulation(false)} title="Termina">
                        <XCircle size={18} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="sim-progress-bar">
                    <div className="sim-progress-bar__fill" style={{ width: `${progress}%` }} />
                </div>

                {/* Question and Reference Text */}
                <div className="sim-question-wrap animate-fade-in-up">
                    {q.referenceText && (
                        <div className="sim-reference-text" style={{ padding: 'var(--space-md)', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-md)', fontSize: '0.95rem', fontStyle: 'italic', borderLeft: '4px solid var(--color-accent-gold)' }}>
                            {q.referenceText}
                        </div>
                    )}
                    <div className="sim-question">
                        <p className="sim-question__text">{q.question}</p>
                    </div>

                    <div className="sim-options">
                        {(q.options as unknown as string[]).map((opt: string, i: number) => {
                            const letter = ['A', 'B', 'C', 'D'][i]
                            let optClass = 'sim-option'
                            if (showFeedback) {
                                if (opt === q.correctAnswer) optClass += ' sim-option--correct'
                                else if (opt === selected) optClass += ' sim-option--wrong'
                                else optClass += ' sim-option--dimmed'
                            } else if (selected === opt) {
                                optClass += ' sim-option--selected'
                            }

                            return (
                                <button
                                    key={opt}
                                    className={optClass}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={showFeedback}
                                >
                                    <span className="sim-option__letter">{letter}</span>
                                    <span className="sim-option__text">{opt}</span>
                                </button>
                            )
                        })}
                    </div>

                    {!showFeedback && (
                        <button className="sim-skip-btn" onClick={skipQuestion}>
                            Salta domanda →
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // =========================================
    // RESULTS (or TIMEOUT)
    // =========================================
    const grade = getGrade(Math.max(0, totalScore))
    const minutesUsed = Math.floor(timeUsed / 60)
    const secsUsed = timeUsed % 60

    return (
        <div className="sim-results animate-pop-in">
            <div className="sim-results__header">
                {phase === 'timeout' ? (
                    <>
                        <AlertTriangle size={48} style={{ color: 'var(--color-accent-amber)' }} />
                        <h1 className="sim-results__title">Tempo scaduto!</h1>
                        <p className="sim-results__sub">
                            Hai risposto a {answers.length} domande su {simQuestions.length}.
                        </p>
                    </>
                ) : (
                    <>
                        <Trophy size={48} style={{ color: grade.color }} />
                        <h1 className="sim-results__title">{grade.icon} {grade.label}</h1>
                        <p className="sim-results__sub">Simulazione completata</p>
                    </>
                )}
            </div>

            {/* Score big number */}
            <div className="sim-results__score-wrap">
                <span className="sim-results__score" style={{ color: grade.color }}>
                    {Math.max(0, totalScore).toFixed(2)}
                </span>
                <span className="sim-results__score-label">punti / {(currentLimitQuestions * 0.75).toFixed(2)} max</span>
            </div>

            {/* Stats grid */}
            <div className="sim-results__stats stagger-children">
                <div className="sim-stat-card">
                    <CheckCircle2 size={20} style={{ color: 'var(--color-accent-green)' }} />
                    <span className="sim-stat-card__value" style={{ color: 'var(--color-accent-green)' }}>{correctCount}</span>
                    <span className="sim-stat-card__label">Corrette</span>
                </div>
                <div className="sim-stat-card">
                    <XCircle size={20} style={{ color: 'var(--color-accent-red)' }} />
                    <span className="sim-stat-card__value" style={{ color: 'var(--color-accent-red)' }}>{wrongCount}</span>
                    <span className="sim-stat-card__label">Errate</span>
                </div>
                <div className="sim-stat-card">
                    <BarChart3 size={20} style={{ color: 'var(--color-text-muted)' }} />
                    <span className="sim-stat-card__value">{skippedCount}</span>
                    <span className="sim-stat-card__label">Saltate</span>
                </div>
                <div className="sim-stat-card">
                    <Timer size={20} style={{ color: 'var(--color-accent-blue)' }} />
                    <span className="sim-stat-card__value" style={{ color: 'var(--color-accent-blue)' }}>
                        {minutesUsed}'{secsUsed.toString().padStart(2, '0')}''
                    </span>
                    <span className="sim-stat-card__label">Tempo usato</span>
                </div>
            </div>

            {/* Score bar */}
            <div className="sim-results__bar-wrap">
                <div className="progress-bar" style={{ height: '10px' }}>
                    <div
                        className="progress-bar__fill"
                        style={{
                            width: `${Math.min(100, (Math.max(0, totalScore) / (currentLimitQuestions * 0.75)) * 100)}%`,
                            background: grade.color,
                            transition: 'width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>0</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{currentLimitQuestions * 0.75} max</span>
                </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={startSimulation} style={{ marginTop: 'var(--space-lg)' }}>
                <RotateCcw size={18} />
                Nuova Simulazione
            </button>
        </div>
    )
}
