import { useMemo } from 'react'
import { useQuiz } from '../context/QuizProvider'
import { useAuth } from '../context/AuthProvider'
import { BookOpen, Target, TrendingUp, Zap, Award, BarChart3, RefreshCcw } from 'lucide-react'
import './Statistics.css'

export default function Statistics() {
    const { user } = useAuth()
    const { stats, userProgress, questions, getLeitnerStats, resetProgress } = useQuiz()

    const leitner = getLeitnerStats()   // array[0..5] = count per box
    const totalLeitner = leitner.reduce((s, v) => s + v, 0)

    const accuracy = stats.totalAnswered > 0
        ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
        : 0

    const profile = user?.selectedProfile ?? null

    const categoryStats = useMemo(() => {
        const filtered = questions.filter(q =>
            q.profileId === null || q.profileId === profile
        )
        const cats: Record<string, { total: number; seen: number; correct: number }> = {}
        filtered.forEach(q => {
            const cat = q.category
            if (!cats[cat]) cats[cat] = { total: 0, seen: 0, correct: 0 }
            cats[cat].total++
            const prog = userProgress[q.id]
            if (prog && prog.history.length > 0) {
                cats[cat].seen++
                cats[cat].correct += prog.history.filter(Boolean).length
            }
        })
        return Object.entries(cats)
            .map(([name, data]) => ({
                name,
                ...data,
                seenPct: Math.round((data.seen / data.total) * 100),
                accuracyPct: data.seen > 0 ? Math.round((data.correct / (data.seen * 5)) * 100) : 0,
            }))
            .sort((a, b) => b.total - a.total)
    }, [questions, userProgress, profile])

    const totalQ = questions.filter(q =>
        q.profileId === null || q.profileId === profile
    ).length

    const seenQ = Object.values(userProgress).filter(p => p.history.length > 0).length
    const masteredQ = leitner.slice(4).reduce((s, v) => s + v, 0) // box 4 + 5

    const leitnerColors = [
        'var(--color-text-muted)',
        'var(--color-accent-red)',
        'var(--color-accent-amber)',
        'var(--color-accent-blue)',
        'var(--color-accent-blue-light)',
        'var(--color-accent-green)',
    ]

    return (
        <div className="stats-page animate-fade-in-up">
            <div className="stats-header">
                <h1 className="stats-header__title">Statistiche</h1>
                <p className="stats-header__sub">
                    Panoramica dei tuoi progressi di studio
                </p>
            </div>

            {/* KPI strip */}
            <div className="stats-kpi stagger-children">
                <div className="stats-kpi__item">
                    <div className="stats-kpi__icon" style={{ background: 'rgba(62,207,142,0.12)', color: 'var(--color-accent-green)' }}>
                        <Target size={22} />
                    </div>
                    <div className="stats-kpi__body">
                        <span className="stats-kpi__value" style={{ color: 'var(--color-accent-green)' }}>
                            {accuracy}%
                        </span>
                        <span className="stats-kpi__label">Accuratezza</span>
                    </div>
                </div>
                <div className="stats-kpi__item">
                    <div className="stats-kpi__icon" style={{ background: 'rgba(74,144,217,0.12)', color: 'var(--color-accent-blue)' }}>
                        <BookOpen size={22} />
                    </div>
                    <div className="stats-kpi__body">
                        <span className="stats-kpi__value">{stats.totalAnswered}</span>
                        <span className="stats-kpi__label">Domande risposte</span>
                    </div>
                </div>
                <div className="stats-kpi__item">
                    <div className="stats-kpi__icon" style={{ background: 'var(--color-accent-gold-dim)', color: 'var(--color-accent-gold)' }}>
                        <Zap size={22} />
                    </div>
                    <div className="stats-kpi__body">
                        <span className="stats-kpi__value" style={{ color: 'var(--color-accent-gold)' }}>
                            {stats.currentStreak}
                        </span>
                        <span className="stats-kpi__label">Streak corrente</span>
                    </div>
                </div>
                <div className="stats-kpi__item">
                    <div className="stats-kpi__icon" style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--color-accent-amber)' }}>
                        <Award size={22} />
                    </div>
                    <div className="stats-kpi__body">
                        <span className="stats-kpi__value" style={{ color: 'var(--color-accent-amber)' }}>
                            {stats.bestStreak}
                        </span>
                        <span className="stats-kpi__label">Streak record</span>
                    </div>
                </div>
                <div className="stats-kpi__item">
                    <div className="stats-kpi__icon" style={{ background: 'rgba(74,144,217,0.12)', color: 'var(--color-accent-blue)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div className="stats-kpi__body">
                        <span className="stats-kpi__value">{stats.xp} XP</span>
                        <span className="stats-kpi__label">Livello {stats.level}</span>
                    </div>
                </div>
            </div>

            {/* Coverage bar */}
            <div className="glass-card stats-coverage">
                <div className="stats-coverage__header">
                    <span>Copertura domande</span>
                    <span className="stats-coverage__nums">
                        {seenQ} / {totalQ}
                    </span>
                </div>
                <div className="progress-bar" style={{ height: '8px', marginTop: 'var(--space-sm)' }}>
                    <div
                        className="progress-bar__fill"
                        style={{ width: `${totalQ > 0 ? Math.round((seenQ / totalQ) * 100) : 0}%` }}
                    />
                </div>
                <div className="stats-coverage__sub">
                    <span style={{ color: 'var(--color-accent-green)' }}>
                        {masteredQ} domande padronate (Box 4–5)
                    </span>
                </div>
            </div>

            {/* Leitner boxes */}
            <div className="glass-card stats-leitner">
                <div className="stats-leitner__header">
                    <BarChart3 size={18} style={{ color: 'var(--color-accent-gold)' }} />
                    <h3 className="stats-leitner__title">Sistema Leitner (SRS)</h3>
                </div>
                <p className="stats-leitner__desc">
                    Le domande vengono distribuite in 6 scatole. Rispondere correttamente sposta una domanda a una scatola superiore (meno frequente). Sbagliare la riporta indietro.
                </p>
                <div className="stats-leitner__bars">
                    {leitner.map((count, i) => {
                        const pct = totalLeitner > 0 ? (count / totalLeitner) * 100 : 0
                        return (
                            <div key={i} className="leitner-bar">
                                <div className="leitner-bar__track">
                                    <div
                                        className="leitner-bar__fill"
                                        style={{
                                            height: `${Math.max(pct, count > 0 ? 5 : 0)}%`,
                                            background: leitnerColors[i],
                                        }}
                                    />
                                </div>
                                <span className="leitner-bar__count" style={{ color: leitnerColors[i] }}>
                                    {count}
                                </span>
                                <span className="leitner-bar__label">{`B${i}`}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Categories breakdown */}
            {categoryStats.length > 0 && (
                <div className="glass-card stats-categories">
                    <h3 className="stats-categories__title">Performance per Materia</h3>
                    <div className="stats-cat-list">
                        {categoryStats.map(cat => (
                            <div key={cat.name} className="stats-cat-row">
                                <div className="stats-cat-row__info">
                                    <span className="stats-cat-row__name">{cat.name}</span>
                                    <span className="stats-cat-row__seen">
                                        {cat.seen}/{cat.total} viste
                                    </span>
                                </div>
                                <div className="stats-cat-row__bar-wrap">
                                    <div className="progress-bar" style={{ height: '6px' }}>
                                        <div
                                            className="progress-bar__fill"
                                            style={{ width: `${cat.seenPct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* XP Level progress */}
            <div className="glass-card stats-xp">
                <div className="stats-xp__header">
                    <span>Livello {stats.level}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                        {stats.xp % 100} / 100 XP → Livello {stats.level + 1}
                    </span>
                </div>
                <div className="progress-bar" style={{ height: '8px', marginTop: 'var(--space-sm)' }}>
                    <div
                        className="progress-bar__fill progress-bar__fill--blue"
                        style={{ width: `${stats.xp % 100}%` }}
                    />
                </div>
            </div>

            {/* Reset */}
            <div className="stats-reset">
                <button
                    className="btn btn-ghost"
                    onClick={() => {
                        if (confirm('Sei sicuro di voler azzerare tutti i progressi?')) {
                            resetProgress()
                        }
                    }}
                >
                    <RefreshCcw size={16} />
                    Azzera progressi
                </button>
            </div>
        </div>
    )
}
