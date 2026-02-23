import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { PROFILES, type ProfileId } from '../types'
import { FileText, TrendingUp, Monitor, Ruler, Check, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './ProfileSelect.css'

const ICONS: Record<string, React.ReactNode> = {
    FileText: <FileText size={24} />,
    TrendingUp: <TrendingUp size={24} />,
    Monitor: <Monitor size={24} />,
    Ruler: <Ruler size={24} />,
}

function ProfileSelect() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loadingId, setLoadingId] = useState<ProfileId | null>(null)

    if (!user) return null

    const handleSelect = async (profileId: ProfileId) => {
        if (loadingId) return
        setLoadingId(profileId)

        try {
            // Aggiorna il profilo selezionato in localStorage
            const updatedUser = { ...user, selectedProfile: profileId }
            localStorage.setItem('ripam_user', JSON.stringify(updatedUser))

            // Aggiorna anche nell'elenco utenti
            const storedUsers = JSON.parse(localStorage.getItem('ripam_users') || '{}')
            if (storedUsers[user.email]) {
                storedUsers[user.email].selectedProfile = profileId
                localStorage.setItem('ripam_users', JSON.stringify(storedUsers))
            }

            // Simuliamo un leggero delay per UX premium
            await new Promise(resolve => setTimeout(resolve, 400))

            // Refresh della pagina per aggiornare il context
            navigate('/')
        } catch (error) {
            console.error('Errore durante la selezione del profilo', error)
            setLoadingId(null)
        }
    }

    return (
        <div className="profile-select">
            <div className="profile-select__header">
                <h1>Scegli il tuo profilo</h1>
                <p>
                    Seleziona il profilo del concorso a cui partecipi.
                    Le domande e le materie di studio saranno personalizzate.
                </p>
            </div>

            <div className="profile-select__grid stagger-children">
                {PROFILES.map((profile) => {
                    const isSelected = user.selectedProfile === profile.id
                    const isLoading = loadingId === profile.id

                    return (
                        <div
                            key={profile.id}
                            className={`profile-card ${isSelected ? 'profile-card--selected' : ''} ${isLoading ? 'profile-card--loading' : ''}`}
                            onClick={() => handleSelect(profile.id)}
                            role="button"
                            tabIndex={0}
                        >
                            {isSelected && !isLoading && (
                                <div className="profile-card__check animate-fade-in">
                                    <Check size={16} />
                                </div>
                            )}
                            {isLoading && (
                                <div className="profile-card__check animate-fade-in">
                                    <Loader2 size={16} className="animate-spin" />
                                </div>
                            )}

                            <div className="profile-card__header">
                                <div className="profile-card__icon">
                                    {ICONS[profile.icon]}
                                </div>
                                <div className="profile-card__badge">{profile.id}</div>
                            </div>

                            <div className="profile-card__content">
                                <div className="profile-card__name">{profile.name}</div>
                                <div className="profile-card__desc">{profile.description}</div>

                                <div className="profile-card__positions">
                                    <span className="profile-card__positions-number">
                                        {profile.totalPositions.toLocaleString('it-IT')}
                                    </span>
                                    <span className="profile-card__positions-label">posti disponibili</span>
                                </div>

                                <div className="profile-card__subjects">
                                    {profile.subjects.slice(0, 3).map((subject) => (
                                        <span key={subject} className="profile-card__subject-tag">
                                            {subject.length > 30 ? subject.slice(0, 30) + '…' : subject}
                                        </span>
                                    ))}
                                    {profile.subjects.length > 3 && (
                                        <span className="profile-card__subject-tag">
                                            +{profile.subjects.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {user.selectedProfile && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/')}
                    >
                        Vai alla Dashboard
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileSelect
