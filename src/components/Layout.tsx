import { useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { LayoutDashboard, GraduationCap, ClipboardCheck, LogOut, User } from 'lucide-react'
import './Layout.css'

export function Layout() {
    const { user, logout, loading } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [user, loading, navigate])

    if (loading) return <div className="loading-overlay">Caricamento...</div>
    if (!user) return null

    const initials = user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="app-layout">
            {/* Navbar */}
            <nav className="navbar">
                <Link to="/" className="navbar__brand">
                    <div className="navbar__logo">R</div>
                    <div className="navbar__title">
                        Quiz <span>RIPAM</span>
                    </div>
                </Link>

                <div className="navbar__actions">
                    <div className="navbar__user" onClick={() => navigate('/profile')}>
                        <div className="navbar__avatar">{initials}</div>
                        <span className="navbar__username">{user.displayName}</span>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Esci">
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            {/* Contenuto principale */}
            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation (mobile) */}
            <nav className="bottom-nav">
                <ul className="bottom-nav__list">
                    <li className="bottom-nav__item">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `bottom-nav__link ${isActive ? 'bottom-nav__link--active' : ''}`
                            }
                        >
                            <LayoutDashboard size={20} />
                            <span className="bottom-nav__label">Home</span>
                        </NavLink>
                    </li>
                    <li className="bottom-nav__item">
                        <NavLink
                            to="/profilo-concorso"
                            className={({ isActive }) =>
                                `bottom-nav__link ${isActive ? 'bottom-nav__link--active' : ''}`
                            }
                        >
                            <GraduationCap size={20} />
                            <span className="bottom-nav__label">Profilo</span>
                        </NavLink>
                    </li>
                    <li className="bottom-nav__item">
                        <NavLink
                            to="/study"
                            className={({ isActive }) =>
                                `bottom-nav__link ${isActive ? 'bottom-nav__link--active' : ''}`
                            }
                        >
                            <ClipboardCheck size={20} />
                            <span className="bottom-nav__label">Studio</span>
                        </NavLink>
                    </li>
                    <li className="bottom-nav__item">
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `bottom-nav__link ${isActive ? 'bottom-nav__link--active' : ''}`
                            }
                        >
                            <User size={20} />
                            <span className="bottom-nav__label">Account</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
