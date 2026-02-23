import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './InfoPages.css'

function TermsOfService() {
    const navigate = useNavigate()

    return (
        <div className="info-page">
            <button className="info-page__back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                Indietro
            </button>

            <div className="info-page__header">
                <h1>Termini di Servizio</h1>
                <p>Condizioni generali di utilizzo</p>
            </div>

            <div className="info-page__content">
                <div className="info-page__section">
                    <h2>1. Premessa</h2>
                    <p>
                        I presenti Termini di Servizio ("Termini") regolano l'utilizzo
                        dell'applicazione web Quiz RIPAM ("Servizio"), sviluppata e gestita
                        da Quiz RIPAM ("Fornitore"). Utilizzando il Servizio, l'utente
                        accetta integralmente i presenti Termini.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>2. Descrizione del servizio</h2>
                    <p>
                        Quiz RIPAM è un'applicazione web di preparazione al concorso pubblico
                        RIPAM per il reclutamento di 3.997 unità di personale non dirigenziale.
                        Il Servizio offre:
                    </p>
                    <ul>
                        <li>Quiz a risposta multipla organizzati per profilo e materia</li>
                        <li>Simulazioni d'esame con timer e punteggio</li>
                        <li>Sistema di studio con ripetizione spaziata</li>
                        <li>Statistiche di apprendimento personalizzate</li>
                        <li>Calcolatore del punteggio titoli</li>
                    </ul>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>3. Registrazione e account</h2>
                    <p>
                        Per utilizzare il Servizio è necessario creare un account fornendo
                        dati veritieri e aggiornati. L'utente è responsabile della
                        riservatezza delle proprie credenziali di accesso e di tutte le
                        attività svolte tramite il proprio account.
                    </p>
                    <p>
                        Il Fornitore si riserva il diritto di sospendere o eliminare gli
                        account che violino i presenti Termini o che risultino inattivi per
                        un periodo superiore a 12 mesi.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>4. Contenuti e proprietà intellettuale</h2>
                    <p>
                        Tutti i contenuti presenti nell'applicazione — inclusi testi, quiz,
                        grafica, layout e codice sorgente — sono di proprietà del Fornitore
                        e sono protetti dalle leggi sulla proprietà intellettuale. È vietata
                        la riproduzione, distribuzione o modifica non autorizzata.
                    </p>
                    <p>
                        Le domande quiz sono elaborate a scopo didattico e formativo. Il
                        Fornitore non garantisce la corrispondenza esatta con le domande
                        che saranno somministrate nella prova concorsuale ufficiale.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>5. Limitazione di responsabilità</h2>
                    <p>
                        Il Servizio è fornito "così com'è" senza garanzie di alcun tipo.
                        Il Fornitore non garantisce che il Servizio sia privo di errori,
                        interruzioni o vulnerabilità. In nessun caso il Fornitore sarà
                        responsabile per danni diretti o indiretti derivanti dall'utilizzo o
                        dall'impossibilità di utilizzo del Servizio.
                    </p>
                    <p>
                        Il Servizio ha esclusivamente finalità didattiche e di preparazione.
                        Il superamento degli esercizi proposti non garantisce il superamento
                        del concorso.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>6. Utilizzo accettabile</h2>
                    <p>L'utente si impegna a:</p>
                    <ul>
                        <li>Utilizzare il Servizio esclusivamente per finalità personali e di studio</li>
                        <li>Non condividere le proprie credenziali con terzi</li>
                        <li>Non tentare di accedere in modo non autorizzato ai sistemi del Fornitore</li>
                        <li>Non utilizzare strumenti automatizzati per accedere al Servizio</li>
                        <li>Non riprodurre o distribuire i contenuti senza autorizzazione</li>
                    </ul>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>7. Modifiche ai termini</h2>
                    <p>
                        Il Fornitore si riserva il diritto di modificare i presenti Termini
                        in qualsiasi momento. Le modifiche saranno comunicate tramite
                        l'applicazione e diventeranno efficaci dalla data di pubblicazione.
                        L'utilizzo continuato del Servizio dopo la pubblicazione delle
                        modifiche costituisce accettazione dei nuovi Termini.
                    </p>
                </div>

                <hr className="info-page__divider" />

                <div className="info-page__section">
                    <h2>8. Legge applicabile</h2>
                    <p>
                        I presenti Termini sono regolati dalla legge italiana. Per qualsiasi
                        controversia derivante dall'interpretazione o dall'applicazione dei
                        presenti Termini è competente il Foro di [città].
                    </p>
                </div>

                <p className="info-page__last-update">
                    Ultimo aggiornamento: Febbraio 2026
                </p>
            </div>
        </div>
    )
}

export default TermsOfService
