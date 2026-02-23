import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './InfoPages.css'

function PrivacyPolicy() {
    const navigate = useNavigate()

    return (
        <div className="info-page">
            <button className="info-page__back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                Indietro
            </button>

            <div className="info-page__header">
                <h1>Privacy Policy</h1>
                <p>Come trattiamo i tuoi dati personali</p>
            </div>

            <div className="info-page__content">
                <div className="info-page__section">
                    <h2>1. Titolare del trattamento</h2>
                    <p>
                        Il titolare del trattamento dei dati personali è Quiz RIPAM
                        (di seguito "il Titolare"), con sede in [indirizzo], email:{' '}
                        <a href="mailto:privacy@quizripam.it">privacy@quizripam.it</a>.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>2. Dati raccolti</h2>
                    <p>L'applicazione raccoglie i seguenti dati personali:</p>
                    <ul>
                        <li>
                            <strong>Dati di registrazione:</strong> nome, cognome, indirizzo email
                            e password (conservata in forma criptata)
                        </li>
                        <li>
                            <strong>Dati di utilizzo:</strong> progressi nello studio, risposte ai quiz,
                            statistiche di apprendimento e preferenze dell'applicazione
                        </li>
                        <li>
                            <strong>Dati tecnici:</strong> informazioni sul dispositivo, indirizzo IP,
                            tipo di browser e sistema operativo (raccolti automaticamente)
                        </li>
                    </ul>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>3. Finalità del trattamento</h2>
                    <p>I dati personali sono trattati per le seguenti finalità:</p>
                    <ul>
                        <li>Creazione e gestione dell'account utente</li>
                        <li>Erogazione del servizio di preparazione ai concorsi</li>
                        <li>Personalizzazione dell'esperienza di studio</li>
                        <li>Salvataggio e sincronizzazione dei progressi</li>
                        <li>Miglioramento del servizio e analisi statistiche aggregate</li>
                        <li>Comunicazioni relative al servizio</li>
                    </ul>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>4. Base giuridica</h2>
                    <p>
                        Il trattamento dei dati si fonda sul consenso dell'interessato
                        (art. 6, par. 1, lett. a del GDPR) e sull'esecuzione del contratto
                        di servizio (art. 6, par. 1, lett. b del GDPR).
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>5. Conservazione dei dati</h2>
                    <p>
                        I dati personali saranno conservati per il tempo necessario al
                        perseguimento delle finalità di cui sopra e, in ogni caso, per un
                        periodo non superiore a 24 mesi dall'ultimo accesso all'applicazione.
                        In caso di cancellazione dell'account, tutti i dati verranno eliminati
                        entro 30 giorni.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>6. Diritti dell'interessato</h2>
                    <p>
                        Ai sensi degli articoli 15-22 del Regolamento (UE) 2016/679 (GDPR),
                        l'utente ha diritto di:
                    </p>
                    <ul>
                        <li>Accedere ai propri dati personali</li>
                        <li>Richiedere la rettifica di dati inesatti</li>
                        <li>Richiedere la cancellazione dei propri dati</li>
                        <li>Limitare il trattamento dei propri dati</li>
                        <li>Richiedere la portabilità dei dati</li>
                        <li>Opporsi al trattamento</li>
                        <li>Revocare il consenso in qualsiasi momento</li>
                        <li>
                            Proporre reclamo all'Autorità Garante per la Protezione dei Dati
                            Personali
                        </li>
                    </ul>
                    <p>
                        Per esercitare i propri diritti, l'utente può scrivere a:{' '}
                        <a href="mailto:privacy@quizripam.it">privacy@quizripam.it</a>
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>7. Cookie</h2>
                    <p>
                        L'applicazione utilizza esclusivamente cookie tecnici necessari al
                        funzionamento del servizio. Non vengono utilizzati cookie di
                        profilazione o di terze parti a fini pubblicitari.
                    </p>
                </div>

                <p className="info-page__last-update">
                    Ultimo aggiornamento: Febbraio 2026
                </p>
            </div>
        </div>
    )
}

export default PrivacyPolicy
