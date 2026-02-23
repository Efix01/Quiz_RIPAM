import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './InfoPages.css'

function ChiSiamo() {
    const navigate = useNavigate()

    return (
        <div className="info-page">
            <button className="info-page__back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                Indietro
            </button>

            <div className="info-page__header">
                <h1>Chi Siamo</h1>
                <p>Il team dietro Quiz RIPAM</p>
            </div>

            <div className="info-page__content">
                <div className="info-page__section">
                    <h2>La nostra missione</h2>
                    <p>
                        Quiz RIPAM nasce con l'obiettivo di offrire uno strumento di preparazione
                        moderno, efficace e accessibile per il concorso pubblico RIPAM — uno dei più
                        importanti concorsi per l'accesso alla Pubblica Amministrazione italiana, con
                        ben 3.997 posti disponibili nell'Area degli Assistenti.
                    </p>
                    <p>
                        Crediamo che ogni candidato meriti gli strumenti migliori per prepararsi
                        al meglio. La nostra piattaforma utilizza tecniche di apprendimento basate
                        sull'evidenza, come la ripetizione spaziata (sistema Leitner), per
                        ottimizzare lo studio e massimizzare la memorizzazione a lungo termine.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>Cosa offriamo</h2>
                    <ul>
                        <li>
                            <strong>Quiz personalizzati</strong> — Domande specifiche per ogni profilo
                            del concorso (Amministrativo, Economico, Informatico, Tecnico)
                        </li>
                        <li>
                            <strong>Simulazione d'esame</strong> — 40 domande in 60 minuti, con
                            punteggio calcolato esattamente come all'esame reale
                        </li>
                        <li>
                            <strong>Studio intelligente</strong> — Il sistema di ripetizione spaziata
                            ti ripropone le domande al momento giusto
                        </li>
                        <li>
                            <strong>Calcolatore titoli</strong> — Calcola il tuo punteggio per diploma,
                            lauree, master e dottorati secondo i criteri del bando
                        </li>
                        <li>
                            <strong>Statistiche dettagliate</strong> — Monitora i tuoi progressi per
                            materia e identifica le aree da migliorare
                        </li>
                    </ul>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>Il team</h2>
                    <p>
                        Siamo un gruppo di professionisti appassionati di tecnologia e formazione,
                        con esperienza nella preparazione ai concorsi pubblici.
                    </p>
                    <div className="info-page__team">
                        <div className="team-card">
                            <div className="team-card__avatar">QR</div>
                            <div className="team-card__name">Quiz RIPAM</div>
                            <div className="team-card__role">Team di sviluppo</div>
                        </div>
                    </div>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>Contatti</h2>
                    <p>
                        Per domande, suggerimenti o segnalazioni puoi contattarci
                        all'indirizzo email:{' '}
                        <a href="mailto:info@quizripam.it">info@quizripam.it</a>
                    </p>
                </div>

                <p className="info-page__last-update">
                    Ultimo aggiornamento: Febbraio 2026
                </p>
            </div>
        </div>
    )
}

export default ChiSiamo
