import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import './Login.css'

// Zod Schema
const loginSchema = z.object({
    email: z.string()
        .min(1, "L'email è richiesta")
        .email("Email non valida"),
    password: z.string()
        .min(6, "Minimo 6 caratteri"),
    displayName: z.string().optional(),
})

const registerSchema = loginSchema.extend({
    displayName: z.string()
        .min(2, 'Il nome è richiesto per la registrazione'),
})

type LoginFormInputs = z.infer<typeof loginSchema>

function Login() {
    const [isRegister, setIsRegister] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { login, register, error, clearError, loading } = useAuth()
    const navigate = useNavigate()

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    })

    const onSubmit = async (data: LoginFormInputs) => {
        clearError()
        try {
            if (isRegister) {
                // Assert displayName is string here due to conditional schema
                await register(data.email, data.password, data.displayName as string)
            } else {
                await login(data.email, data.password)
            }
            navigate('/')
        } catch {
            // Error handling done by AuthProvider context
        }
    }

    const toggleMode = () => {
        setIsRegister(!isRegister)
        clearError()
        reset()
    }

    return (
        <div className="login-page">
            {/* ---- Pannello Sinistro: Branding / Editoriale ---- */}
            <div className="login-branding">
                <div className="login-branding__top">
                    <div className="login-branding__logo">
                        <div className="login-logo">R</div>
                        <span className="login-branding__app-name">Quiz <span>RIPAM</span></span>
                    </div>
                    <h1 className="login-branding__headline">
                        Preparati al<br />
                        <em>concorso</em> che<br />
                        cambia tutto.
                    </h1>
                    <p className="login-branding__sub">
                        La piattaforma definitiva per i candidati al concorso pubblico RIPAM.
                        Studia con metodo, traccia i tuoi progressi, conquista il posto.
                    </p>
                </div>

                <div className="login-branding__bottom">
                    <div className="login-branding__stats">
                        <div className="login-stat">
                            <span className="login-stat__value">3.997</span>
                            <span className="login-stat__label">Posti disponibili</span>
                        </div>
                        <div className="login-stat">
                            <span className="login-stat__value">40</span>
                            <span className="login-stat__label">Domande per prova</span>
                        </div>
                        <div className="login-stat">
                            <span className="login-stat__value">60'</span>
                            <span className="login-stat__label">Tempo a disposizione</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---- Pannello Destro: Form ---- */}
            <div className="login-form-panel">
                <div className="login-container">
                    {/* Mobile only header */}
                    <div className="login-header">
                        <div className="login-logo" style={{ margin: '0 auto var(--space-lg)' }}>R</div>
                        <h1 className="login-title">Quiz <span>RIPAM</span></h1>
                        <p className="login-subtitle">Preparati al concorso per 3.997 assistenti</p>
                    </div>

                    {/* Form Card */}
                    <div className="login-card">
                        <h2 className="login-card__heading">
                            {isRegister ? 'Crea il tuo account' : 'Bentornat*'}
                        </h2>
                        <p className="login-card__desc">
                            {isRegister
                                ? 'Inizia la tua preparazione oggi.'
                                : 'Accedi per continuare la tua preparazione.'}
                        </p>

                        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="login-error animate-fade-in">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {isRegister && (
                                <div className="login-field animate-fade-in">
                                    <label className="input-label" htmlFor="displayName">
                                        Nome e Cognome
                                    </label>
                                    <input
                                        id="displayName"
                                        type="text"
                                        className={`input-field ${errors.displayName ? 'input-error' : ''}`}
                                        placeholder="Mario Rossi"
                                        autoComplete="name"
                                        {...formRegister('displayName')}
                                    />
                                    {errors.displayName && (
                                        <span className="input-error-text">{errors.displayName.message}</span>
                                    )}
                                </div>
                            )}

                            <div className="login-field">
                                <label className="input-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`input-field ${errors.email ? 'input-error' : ''}`}
                                    placeholder="mario@esempio.it"
                                    autoComplete="email"
                                    {...formRegister('email')}
                                />
                                {errors.email && (
                                    <span className="input-error-text">{errors.email.message}</span>
                                )}
                            </div>

                            <div className="login-field">
                                <label className="input-label" htmlFor="password">
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`input-field ${errors.password ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                                        style={{ paddingRight: '3rem' }}
                                        {...formRegister('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="input-error-text">{errors.password.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                                style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                            >
                                {loading ? 'Caricamento...' : isRegister ? 'Crea Account' : 'Accedi'}
                            </button>
                        </form>

                        <div className="login-toggle">
                            <span className="login-toggle__text">
                                {isRegister ? 'Hai già un account?' : 'Non hai un account?'}
                            </span>
                            <button
                                className="login-toggle__btn"
                                onClick={toggleMode}
                            >
                                {isRegister ? 'Accedi' : 'Registrati'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

