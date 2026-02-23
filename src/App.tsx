import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { QuizProvider } from './context/QuizProvider'
import { Layout } from './components/Layout'
import { LoadingScreen } from './components/ui/LoadingScreen'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProfileSelect = lazy(() => import('./pages/ProfileSelect'))
const Profile = lazy(() => import('./pages/Profile'))
const StudyMode = lazy(() => import('./pages/StudyMode'))
const Login = lazy(() => import('./pages/Login'))
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))

const Simulation = lazy(() => import('./pages/Simulation'))
const Statistics = lazy(() => import('./pages/Statistics'))
const Titoli = lazy(() => import('./pages/Titoli'))

function App() {
    return (
        <AuthProvider>
            <QuizProvider>
                <Router>
                    <Suspense fallback={<LoadingScreen />}>
                        <Routes>
                            {/* Auth - pagina full screen */}
                            <Route path="/login" element={<Login />} />

                            {/* App con layout */}
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="profilo-concorso" element={<ProfileSelect />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="study" element={<StudyMode />} />
                                <Route path="simulation" element={<Simulation />} />
                                <Route path="stats" element={<Statistics />} />
                                <Route path="titoli" element={<Titoli />} />
                                <Route path="chi-siamo" element={<ChiSiamo />} />
                                <Route path="privacy" element={<PrivacyPolicy />} />
                                <Route path="termini" element={<TermsOfService />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </Router>
            </QuizProvider>
        </AuthProvider>
    )
}

export default App
