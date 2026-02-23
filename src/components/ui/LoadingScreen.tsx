import './LoadingScreen.css'

export function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-screen__spinner" />
            <span className="loading-screen__text">Caricamento...</span>
        </div>
    )
}
