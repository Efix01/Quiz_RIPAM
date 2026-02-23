import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { PROFILES } from '../types'
import { BookOpen, ClipboardCheck, BarChart3, GraduationCap, ChevronRight } from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    if (!user) return null

    const selectedProfile = user.selectedProfile
        ? PROFILES.find(p => p.id === user.selectedProfile)
        : null

    const firstName = user.displayName.split(' ')[0]

    // Formatta la data in italiano
    const today = new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard__header">
                <h1 className="dashboard__greeting">
                    Ciao, <span>{firstName}</span>
                </h1>
                <p className="dashboard__date">{today}</p>
            </div>

            {/* Profilo selezionato o invito a selezionarne uno */}
            {selectedProfile ? (
                <>
                    <div
                        className="dashboard__profile-banner"
                        onClick={() => navigate('/profilo-concorso')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="dashboard__profile-info">
                            <div className="dashboard__profile-label">Profilo concorso</div>
                            <div className="dashboard__profile-name">{selectedProfile.name}</div>
                            <div className="dashboard__profile-desc">{selectedProfile.description}</div>
                        </div>
                        <div className="badge badge-gold">
                            {selectedProfile.id}
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard__actions stagger-children">
                        <div className="action-card" onClick={() => navigate('/study')}>
                            <div className="action-card__icon action-card__icon--gold">
                                <BookOpen size={22} />
                            </div>
                            <div className="action-card__title">Studio</div>
                            <div className="action-card__desc">
                                Quiz con ripetizione spaziata per memorizzare le materie
                            </div>
                        </div>

                        <div className="action-card" onClick={() => navigate('/simulation')}>
                            <div className="action-card__icon action-card__icon--blue">
                                <ClipboardCheck size={22} />
                            </div>
                            <div className="action-card__title">Simulazione</div>
                            <div className="action-card__desc">
                                40 domande in 60 minuti — come all'esame vero
                            </div>
                        </div>

                        <div className="action-card" onClick={() => navigate('/stats')}>
                            <div className="action-card__icon action-card__icon--green">
                                <BarChart3 size={22} />
                            </div>
                            <div className="action-card__title">Statistiche</div>
                            <div className="action-card__desc">
                                I tuoi progressi per materia e le aree da migliorare
                            </div>
                        </div>

                        <div className="action-card" onClick={() => navigate('/titoli')}>
                            <div className="action-card__icon action-card__icon--amber">
                                <GraduationCap size={22} />
                            </div>
                            <div className="action-card__title">Titoli</div>
                            <div className="action-card__desc">
                                Calcola il tuo punteggio per diploma e lauree
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="dashboard__no-profile animate-fade-in-up">
                    <div className="dashboard__no-profile-icon">
                        <GraduationCap size={36} />
                    </div>
                    <h2>Scegli il tuo profilo</h2>
                    <p>
                        Seleziona il profilo del concorso per cui ti stai preparando.
                        Vedrai solo le domande e le materie rilevanti per te.
                    </p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/profilo-concorso')}
                    >
                        Scegli profilo
                    </button>
                </div>
            )}
        </div>
    )
}

export default Dashboard
