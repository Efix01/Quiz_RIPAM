---
name: skill-creator2
description: Guida per creare skill efficaci. Questa skill dovrebbe essere usata quando gli utenti vogliono creare una nuova skill (o aggiornare una skill esistente) che estende le capacità di Claude con conoscenza specializzata, workflow o integrazioni di tool.
license: Complete terms in LICENSE.txt
---

# Skill Creator

Questa skill fornisce indicazioni per creare skill efficaci.

## Informazioni sulle Skills

Le skill sono pacchetti modulari e autocontenuti che estendono le capacità di Claude fornendo conoscenza specializzata, workflow e tool. Pensale come "guide di onboarding" per domini o task specifici: trasformano Claude da agente general-purpose a agente specializzato equipaggiato con conoscenza procedurale che nessun modello può possedere completamente.

### Cosa Forniscono le Skills

1. **Specialized workflows** - Procedure multi-step per domini specifici
2. **Tool integrations** - Istruzioni per lavorare con formati file o API specifiche
3. **Domain expertise** - Conoscenza aziendale specifica, schemi, logica di business
4. **Bundled resources** - Script, riferimenti e asset per task complessi e ripetitivi

## Principi Fondamentali

### La Concisione è Fondamentale (Concise is Key)

La context window è un bene pubblico. Le skill condividono la finestra di contesto con tutto ciò di cui Claude ha bisogno: system prompt, cronologia conversazione, metadata di altre skill e la richiesta effettiva dell'utente.

**Assunzione di default: Claude è già molto intelligente.** Aggiungi solo contesto che Claude non ha già. Sfida ogni pezzo di informazione: "Claude ha davvero bisogno di questa spiegazione?" e "Questo paragrafo giustifica il suo costo in token?"

Preferisci esempi concisi piuttosto che spiegazioni verbose.

### Imposta Gradi di Libertà Appropriati (Set Appropriate Degrees of Freedom)

Adatta il livello di specificità alla fragilità e variabilità del task:

**Alta libertà (istruzioni testuali)**: Usa quando molteplici approcci sono validi, le decisioni dipendono dal contesto o le euristiche guidano l'approccio.

**Media libertà (pseudocodice o script con parametri)**: Usa quando esiste un pattern preferito, qualche variazione è accettabile o la configurazione influenza il comportamento.

**Bassa libertà (script specifici, pochi parametri)**: Usa quando le operazioni sono fragili e soggette a errori, la consistenza è critica o una sequenza specifica deve essere seguita.

Pensa a Claude come a qualcuno che esplora un percorso: un ponte stretto con dirupi necessita di guardrail specifici (bassa libertà), mentre un campo aperto permette molte rotte (alta libertà).

### Anatomia di una Skill

Ogni skill consiste in un file `SKILL.md` obbligatorio e risorse bundle opzionali:

```
skill-name/
├── SKILL.md (obbligatorio)
│   ├── YAML frontmatter metadata (obbligatorio)
│   │   ├── name: (obbligatorio)
│   │   ├── description: (obbligatorio)
│   │   └── compatibility: (opzionale, raramente necessario)
│   └── Istruzioni Markdown (obbligatorio)
└── Bundled Resources (opzionale)
    ├── scripts/          - Codice eseguibile (Python/Bash/etc.)
    ├── references/       - Documentazione caricata nel contesto al bisogno
    └── assets/           - File usati nell'output (template, icone, font, etc.)
```

#### SKILL.md (obbligatorio)

Ogni SKILL.md consiste in:

- **Frontmatter** (YAML): Contiene i campi `name` e `description` (obbligatori), più campi opzionali come `license`, `metadata` e `compatibility`. Solo `name` e `description` vengono letti da Claude per determinare quando attivare la skill, quindi sii chiaro e completo su cosa fa la skill e quando dovrebbe essere usata. Il campo `compatibility` serve per notare requisiti ambientali (prodotto target, pacchetti di sistema, ecc.) ma la maggior parte delle skill non ne ha bisogno.
- **Corpo** (Markdown): Istruzioni e guida per l'uso della skill. Caricato solo DOPO che la skill si attiva (se si attiva).

#### Risorse Incluse (opzionale)

##### Scripts (`scripts/`)

Codice eseguibile (Python/Bash/etc.) per task che richiedono affidabilità deterministica o vengono riscritti ripetutamente.

- **Quando includerli**: Quando lo stesso codice viene riscritto ripetutamente o serve affidabilità deterministica.
- **Esempio**: `scripts/rotate_pdf.py` per task di rotazione PDF.
- **Benefici**: Efficienti in termini di token, deterministici, possono essere eseguiti senza caricamento nel contesto.
- **Nota**: Gli script potrebbero comunque dover essere letti da Claude per patching o aggiustamenti specifici per l'ambiente.

##### References (`references/`)

Documentazione e materiale di riferimento destinati a essere caricati nel contesto "on-demand" per informare il processo e il ragionamento di Claude.

- **Quando includerli**: Per documentazione che Claude deve consultare mentre lavora.
- **Esempi**: `references/finance.md` per schemi finanziari, `references/mnda.md` per template NDA aziendali, `references/policies.md` per policy aziendali, `references/api_docs.md` per specifiche API.
- **Casi d'uso**: Schemi database, documentazione API, conoscenza di dominio, policy aziendali, guide workflow dettagliate.
- **Benefici**: Mantiene `SKILL.md` snello, caricato solo quando Claude determina che è necessario.
- **Best practice**: Se i file sono grandi (>10k parole), includi pattern di ricerca grep in `SKILL.md`.
- **Evita duplicazione**: Le informazioni dovrebbero vivere o in `SKILL.md` o nei file references, non in entrambi. Preferisci i file references per informazioni dettagliate a meno che non siano veramente centrali per la skill—questo mantiene `SKILL.md` leggero rendendo le informazioni scopribili senza intasare la context window. Mantieni solo le istruzioni procedurali essenziali e la guida al workflow in `SKILL.md`; sposta materiale di riferimento dettagliato, schemi ed esempi nei file references.

##### Assets (`assets/`)

File non destinati a essere caricati nel contesto, ma usati all'interno dell'output prodotto da Claude.

- **Quando includerli**: Quando la skill necessita di file che verranno usati nell'output finale.
- **Esempi**: `assets/logo.png` per asset del brand, `assets/slides.pptx` per template PowerPoint, `assets/frontend-template/` per boilerplate HTML/React, `assets/font.ttf` per tipografia.
- **Casi d'uso**: Template, immagini, icone, codice boilerplate, font, documenti campione che vengono copiati o modificati.
- **Benefici**: Separa le risorse di output dalla documentazione, permette a Claude di usare file senza caricarli nel contesto.

#### Cosa NON Includere in una Skill

Una skill dovrebbe contenere solo file essenziali che supportano direttamente la sua funzionalità. NON creare documentazione superflua o file ausiliari, inclusi:

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- ecc.

La skill deve contenere solo le informazioni necessarie a un agente AI per svolgere il lavoro. Non deve contenere contesto ausiliario sul processo di creazione, procedure di setup e testing, documentazione user-facing, ecc. Creare file di documentazione aggiuntivi aggiunge solo disordine e confusione.

### Principio di Design "Progressive Disclosure"

Le skill usano un sistema di caricamento a tre livelli per gestire il contesto in modo efficiente:

1. **Metadata (name + description)** - Sempre nel contesto (~100 parole)
2. **Corpo SKILL.md** - Quando la skill si attiva (<5k parole)
3. **Risorse incluse** - Al bisogno di Claude (Illimitato perché gli script possono essere eseguiti senza leggerli nella context window)

#### Pattern di Progressive Disclosure

Mantieni il corpo di `SKILL.md` essenziale e sotto le 500 righe per minimizzare il peso sul contesto. Dividi il contenuto in file separati quando ci si avvicina a questo limite. Quando separi il contenuto in altri file, è molto importante referenziarli da `SKILL.md` e descrivere chiaramente quando leggerli, per assicurare che il lettore della skill sappia della loro esistenza e quando usarli.

**Principio chiave:** Quando una skill supporta molteplici variazioni, framework o opzioni, mantieni solo il workflow principale e la guida alla selezione in `SKILL.md`. Sposta i dettagli specifici delle varianti (pattern, esempi, configurazione) in file reference separati.

**Pattern 1: Guida di alto livello con riferimenti**

```markdown
# Elaborazione PDF

## Quick start

Estrai testo con pdfplumber:
[esempio codice]

## Funzionalità avanzate

- **Compilazione moduli**: Vedi [FORMS.md](FORMS.md) per la guida completa
- **Riferimento API**: Vedi [REFERENCE.md](REFERENCE.md) per tutti i metodi
- **Esempi**: Vedi [EXAMPLES.md](EXAMPLES.md) per pattern comuni
```

Claude carica FORMS.md, REFERENCE.md, o EXAMPLES.md solo quando necessario.

**Pattern 2: Organizzazione specifica per dominio**

Per Skill con domini multipli, organizza il contenuto per dominio per evitare di caricare contesto irrilevante:

```
bigquery-skill/
├── SKILL.md (panoramica e navigazione)
└── reference/
    ├── finance.md (entrate, metriche fatturazione)
    ├── sales.md (opportunità, pipeline)
    ├── product.md (uso API, funzionalità)
    └── marketing.md (campagne, attribuzione)
```

Quando un utente chiede metriche di vendita, Claude legge solo sales.md.

Similmente, per skill che supportano framework o varianti multiple, organizza per variante:

```
cloud-deploy/
├── SKILL.md (workflow + selezione provider)
└── references/
    ├── aws.md (pattern deployment AWS)
    ├── gcp.md (pattern deployment GCP)
    └── azure.md (pattern deployment Azure)
```

Quando l'utente sceglie AWS, Claude legge solo aws.md.

**Pattern 3: Dettagli condizionali**

Mostra contenuto base, linka a contenuto avanzato:

```markdown
# Elaborazione DOCX

## Creazione documenti

Usa docx-js per nuovi documenti. Vedi [DOCX-JS.md](DOCX-JS.md).

## Modifica documenti

Per modifiche semplici, modifica direttamente l'XML.

**Per revisioni (tracked changes)**: Vedi [REDLINING.md](REDLINING.md)
**Per dettagli OOXML**: Vedi [OOXML.md](OOXML.md)
```

Claude legge REDLINING.md o OOXML.md solo quando l'utente necessita di quelle funzionalità.

**Linee guida importanti:**

- **Evita riferimenti annidati** - Mantieni i riferimenti a un livello di profondità da `SKILL.md`. Tutti i file reference dovrebbero essere linkati direttamente da `SKILL.md`.
- **Struttura file reference lunghi** - Per file più lunghi di 100 righe, includi un indice all'inizio così Claude può vedere l'intero scopo durante l'anteprima.

## Processo di Creazione Skill

La creazione di una skill coinvolge questi passaggi:

1. Comprendere la skill con esempi concreti
2. Pianificare i contenuti riutilizzabili (script, reference, asset)
3. Inizializzare la skill (eseguire init_skill.py)
4. Modificare la skill (implementare risorse e scrivere SKILL.md)
5. Pacchettizzare la skill (eseguire package_skill.py)
6. Iterare basandosi sull'uso reale

Segui questi passaggi in ordine, saltando solo se c'è una chiara ragione per cui non sono applicabili.

### Passo 1: Comprendere la Skill con Esempi Concreti

Salta questo passo solo quando i pattern d'uso della skill sono già chiaramente compresi. Rimane valido anche quando si lavora con una skill esistente.

Per creare una skill efficace, comprendi chiaramente esempi concreti di come la skill verrà usata. Questa comprensione può venire da esempi diretti dell'utente o esempi generati validati con feedback utente.

Per esempio, quando costruisci una skill `image-editor`, le domande rilevanti includono:

- "Quali funzionalità dovrebbe supportare la skill image-editor? Modifica, rotazione, cos'altro?"
- "Puoi fare alcuni esempi di come questa skill verrebbe usata?"
- "Posso immaginare utenti chiedere cose come 'Rimuovi gli occhi rossi da questa immagine' o 'Ruota questa immagine'. Ci sono altri modi in cui immagini questa skill venga usata?"
- "Cosa direbbe un utente per attivare questa skill?"

Per evitare di sopraffare gli utenti, evita di fare troppe domande in un singolo messaggio. Inizia con le domande più importanti e prosegui se necessario per maggiore efficacia.

Concludi questo passo quando c'è un senso chiaro della funzionalità che la skill deve supportare.

### Passo 2: Pianificare i Contenuti Riutilizzabili

Per trasformare esempi concreti in una skill efficace, analizza ogni esempio:

1. Considerando come eseguire l'esempio da zero
2. Identificando quali script, reference e asset sarebbero utili nell'eseguire questi workflow ripetutamente

Esempio: Quando costruisci una skill `pdf-editor` per gestire richieste come "Aiutami a ruotare questo PDF," l'analisi mostra:

1. Ruotare un PDF richiede di riscrivere lo stesso codice ogni volta
2. Uno script `scripts/rotate_pdf.py` sarebbe utile da conservare nella skill

Esempio: Quando progetti una skill `frontend-webapp-builder` per richieste come "Costruiscimi una todo app" o "Costruiscimi una dashboard per tracciare i miei passi," l'analisi mostra:

1. Scrivere una webapp frontend richiede lo stesso boilerplate HTML/React ogni volta
2. Un template `assets/hello-world/` contenente i file progetto HTML/React boilerplate sarebbe utile da conservare nella skill

Esempio: Quando costruisci una skill `big-query` per gestire richieste come "Quanti utenti hanno fatto login oggi?" l'analisi mostra:

1. Interrogare BigQuery richiede di riscoprire gli schemi tabella e le relazioni ogni volta
2. Un file `references/schema.md` che documenta gli schemi tabella sarebbe utile da conservare nella skill

Per stabilire i contenuti della skill, analizza ogni esempio concreto per creare una lista di risorse riutilizzabili da includere: script, reference e asset.

### Passo 3: Inizializzare la Skill

A questo punto, è il momento di creare effettivamente la skill.
(Nota: Se usi `creatore-skill`, questo passo è automatizzato dall'agente).
...
[Sezione tecnica init_skill.py e package_skill.py omessa per brevità o adattata se necessario, ma mantengo la traduzione fedele al contenuto originale se rilevante per l'utente, o posso semplificare se l'utente non ha quegli script. Manteniamo la fedeltà al documento originale tradotto.]

Quando crei una nuova skill da zero, esegui sempre lo script `init_skill.py` (se disponibile nell'ambiente).
...
### Passo 4: Modificare la Skill

Quando modifichi la skill (nuova o esistente), ricorda che la skill viene creata per essere usata da un'altra istanza di Claude. Includi informazioni che sarebbero benefiche e non ovvie per Claude. Considera quale conoscenza procedurale, dettagli specifici del dominio o asset riutilizzabili aiuterebbero un'altra istanza di Claude a eseguire questi task più efficacemente.

#### Impara Pattern di Design Comprovati

Consulta guide utili basate sui bisogni della tua skill (es. references/workflows.md per workflow sequenziali).

#### Inizia con Contenuti Riutilizzabili

Inizia l'implementazione dalle risorse riutilizzabili identificate sopra: `scripts/`, `references/`, e `assets/`.

#### Aggiorna SKILL.md

**Linee guida di scrittura:** Usa sempre la forma imperativa/infinito.

##### Frontmatter

Scrivi il frontmatter YAML con `name` e `description`:

- `name`: Il nome della skill
- `description`: Questo è il meccanismo primario di attivazione, e aiuta Claude a capire quando usare la skill.
  - Includi sia cosa fa la Skill sia i trigger/contesti specifici per quando usarla.

##### Corpo

Scrivi istruzioni per usare la skill e le sue risorse incluse.

### Passo 5: Pacchettizzare una Skill

Una volta completato lo sviluppo, la skill deve essere pacchettizzata (es. `scripts/package_skill.py`).
Il processo valida:
- Formato Frontmatter
- Convenzioni di nome e struttura
- Completezza descrizione

### Passo 6: Iterare

Dopo aver testato la skill, migliorare basandosi sull'uso reale.

1. Usa la skill su task reali
2. Nota difficoltà o inefficienze
3. Identifica come aggiornare SKILL.md
4. Implementa modifiche e testa ancora
