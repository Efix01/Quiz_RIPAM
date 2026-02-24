import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { PROFILES } from '../types'
import {
    GraduationCap,
    LogOut,
    Trash2,
    Info,
    FileText,
    Shield,
    ChevronRight,
    AlertTriangle,
} from 'lucide-react'
import './Profile.css'

function Profile() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    if (!user) return null

    const initials = user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const selectedProfile = user.selectedProfile
        ? PROFILES.find(p => p.id === user.selectedProfile)
        : null

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const handleDeleteAccount = () => {
        // Pulisce tutti i dati locali dell'utente
        const storedUsers = JSON.parse(localStorage.getItem('ripam_users') || '{}')
        delete storedUsers[user.email]
        localStorage.setItem('ripam_users', JSON.stringify(storedUsers))
        localStorage.removeItem('ripam_user')
        navigate('/login')
        window.location.reload()
    }

    return (
        <div className="profile-page">
            {/* Header con avatar */}
            <div className="profile-page__header">
                <div className="profile-page__avatar">{initials}</div>
                <h2 className="profile-page__name">{user.displayName}</h2>
                <p className="profile-page__email">{user.email}</p>
                {selectedProfile && (
                    <div className="profile-page__profile-badge">
                        <span className="badge badge-gold">{selectedProfile.name}</span>
                    </div>
                )}
            </div>

            {/* Sezione Concorso */}
            <div className="profile-section stagger-children">
                <div className="profile-section__title">Concorso</div>
                <div className="profile-section__card">
                    <button
                        className="profile-row"
                        onClick={() => navigate('/profilo-concorso')}
                    >
                        <div className="profile-row__icon profile-row__icon--gold">
                            <GraduationCap size={18} />
                        </div>
                        <div className="profile-row__content">
                            <div className="profile-row__label">Profilo concorso</div>
                            <div className="profile-row__sublabel">
                                {selectedProfile ? selectedProfile.name : 'Non selezionato'}
                            </div>
                        </div>
                        <ChevronRight size={18} className="profile-row__chevron" />
                    </button>
                </div>
            </div>

            {/* Sezione Account */}
            <div className="profile-section stagger-children">
                <div className="profile-section__title">Account</div>
                <div className="profile-section__card">
                    <button className="profile-row" onClick={handleLogout}>
                        <div className="profile-row__icon profile-row__icon--blue">
                            <LogOut size={18} />
                        </div>
                        <div className="profile-row__content">
                            <div className="profile-row__label">Esci dall'app</div>
                        </div>
                    </button>

                    <button
                        className="profile-row"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <div className="profile-row__icon profile-row__icon--red">
                            <Trash2 size={18} />
                        </div>
                        <div className="profile-row__content">
                            <div className="profile-row__label profile-row__label--danger">
                                Elimina account
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Sezione Informazioni */}
            <div className="profile-section stagger-children">
                <div className="profile-section__title">Informazioni</div>
                <div className="profile-section__card">
                    <button
                        className="profile-row"
                        onClick={() => navigate('/chi-siamo')}
                    >
                        <div className="profile-row__icon profile-row__icon--blue">
                            <Info size={18} />
                        </div>
                        <div className="profile-row__content">
                            <div className="profile-row__label">Chi Siamo</div>
                        </div>
                        <ChevronRight size={18} className="profile-row__chevron" />
                    </button>

                    <button
                        className="profile-row"
                        onClick={() => navigate('/privacy')}
                    >
                        <div className="profile-row__icon profile-row__icon--green">
                            <Shield size={18} />
                        </div>
                        <div className="profile-row__content">
                            <div className="profile-row__label">Privacy Policy</div>
                        </div>
                        <ChevronRight size={18} className="profile-row__chevron" />
                    </button>

                    <button
                        className="profile-row"
                        onClick={() => navigate('/termini')}
                    >
                        <div className="profile-row__icon profile-row__icon--blue">
                            <FileText size={18} />
                        </div>
                        <div className="profile-row__content">
                            <div className="profile-row__label">Termini di Servizio</div>
                        </div>
                        <ChevronRight size={18} className="profile-row__chevron" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="profile-footer">
                <p className="profile-footer__version">Quiz RIPAM v1.0.0</p>
            </div>

            {/* Dialog conferma eliminazione */}
            {showDeleteConfirm && (
                <div className="profile-confirm">
                    <div
                        className="profile-confirm__backdrop"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    <div className="profile-confirm__dialog">
                        <AlertTriangle
                            size={40}
                            color="var(--color-accent-red)"
                            style={{ marginBottom: 'var(--space-md)' }}
                        />
                        <h3>Elimina account</h3>
                        <p>
                            Sei sicuro? Tutti i tuoi progressi, statistiche e dati verranno
                            eliminati permanentemente. Questa azione non può essere annullata.
                        </p>
                        <div className="profile-confirm__actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Annulla
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-accent-red), #C43E3E)',
                                    boxShadow: '0 2px 12px rgba(224, 92, 92, 0.3)',
                                }}
                                onClick={handleDeleteAccount}
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
