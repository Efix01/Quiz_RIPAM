---
name: performance-agenti
description: Use this skill when evaluating agent performance, building test frameworks, measuring agent quality, creating evaluation rubrics, or working with LLM-as-judge, multi-dimensional evaluation, agent testing, or quality gates. Also activate for valutazione agenti, framework test, metriche qualità, rubrica valutazione.
---

# Metodi di Valutazione per Sistemi Agent

La valutazione dei sistemi agent richiede approcci diversi rispetto al software tradizionale o alle applicazioni standard di modelli linguistici. Gli agent prendono decisioni dinamiche, sono non-deterministici tra esecuzioni diverse, e spesso mancano di risposte singole corrette. Una valutazione efficace deve tenere conto di queste caratteristiche fornendo feedback azionabile. Un framework di valutazione robusto permette miglioramento continuo, individua regressioni, e valida che le scelte di context engineering raggiungano gli effetti desiderati.

## Quando attivare questa skill

Attiva questa skill quando:
- Testi sistematicamente le performance degli agent
- Validi scelte di context engineering
- Misuri miglioramenti nel tempo
- Individui regressioni prima del deployment
- Costruisci quality gates per pipeline di agent
- Confronti diverse configurazioni di agent
- Valuti sistemi in produzione continuamente

## Concetti fondamentali

La valutazione degli agent richiede approcci focalizzati sui risultati che tengano conto di non-determinismo e percorsi multipli validi. Le rubriche multi-dimensionali catturano vari aspetti qualitativi: accuratezza fattuale, completezza, accuratezza citazioni, qualità delle fonti ed efficienza degli strumenti. L'approccio LLM-as-judge fornisce valutazione scalabile mentre la valutazione umana cattura casi limite.

L'insight chiave è che gli agent possono trovare percorsi alternativi verso gli obiettivi—la valutazione dovrebbe giudicare se raggiungono i risultati giusti seguendo processi ragionevoli.

### Performance Drivers: Il Finding del 95%

La ricerca sulla valutazione BrowseComp (che testa la capacità degli browsing agent di localizzare informazioni difficili da trovare) ha scoperto che tre fattori spiegano il 95% della varianza di performance [file:16]:

| Fattore | Varianza spiegata | Implicazione |
|---------|------------------|--------------|
| Utilizzo token | 80% | Più token = migliore performance |
| Numero chiamate tool | ~10% | Maggiore esplorazione aiuta |
| Scelta del modello | ~5% | Modelli migliori moltiplicano efficienza |

Questo finding ha implicazioni significative per il design della valutazione:
- **I budget token contano**: Valuta gli agent con budget token realistici, non risorse illimitate
- **Gli upgrade del modello battono gli aumenti di token**: Passare a Claude Sonnet 4.5 o GPT-5.2 fornisce guadagni maggiori rispetto al raddoppio dei budget token su versioni precedenti
- **Validazione multi-agent**: Il finding valida architetture che distribuiscono lavoro tra agent con finestre di contesto separate

## Argomenti dettagliati

### Sfide di valutazione

**Non-determinismo e percorsi multipli validi**
Gli agent possono prendere percorsi completamente diversi e validi per raggiungere obiettivi. Un agent potrebbe cercare tre fonti mentre un altro ne cerca dieci. Potrebbero usare strumenti diversi per trovare la stessa risposta. Le valutazioni tradizionali che controllano step specifici falliscono in questo contesto.

La soluzione è una valutazione focalizzata sui risultati che giudica se gli agent raggiungono i risultati giusti seguendo processi ragionevoli.

**Fallimenti context-dependent**
I fallimenti degli agent spesso dipendono dal contesto in modi sottili. Un agent potrebbe avere successo su query semplici ma fallire su quelle complesse. Potrebbe funzionare bene con un set di tool ma fallire con un altro. I fallimenti potrebbero emergere solo dopo interazione estesa quando il contesto si accumula.

La valutazione deve coprire un range di livelli di complessità e testare interazioni estese, non solo query isolate.

**Dimensioni qualitative composite**
La qualità degli agent non è una singola dimensione. Include accuratezza fattuale, completezza, coerenza, efficienza tool e qualità del processo. Un agent potrebbe avere punteggio alto in accuratezza ma basso in efficienza, o viceversa.

Le rubriche di valutazione devono catturare dimensioni multiple con ponderazione appropriata per il caso d'uso.

### Design della rubrica di valutazione

**Rubrica multi-dimensionale**
Le rubriche efficaci coprono dimensioni chiave con livelli descrittivi:

- **Accuratezza fattuale**: Le affermazioni corrispondono alla ground truth (da eccellente a fallito)
- **Completezza**: L'output copre gli aspetti richiesti (da eccellente a fallito)
- **Accuratezza citazioni**: Le citazioni corrispondono alle fonti dichiarate (da eccellente a fallito)
- **Qualità fonti**: Usa fonti primarie appropriate (da eccellente a fallito)
- **Efficienza tool**: Usa gli strumenti giusti un numero ragionevole di volte (da eccellente a fallito)

**Scoring della rubrica**
Converti valutazioni dimensionali in punteggi numerici (0.0 a 1.0) con ponderazione appropriata. Calcola punteggi overall ponderati. Determina soglia di superamento basata sui requisiti del caso d'uso.

### Metodologie di valutazione

**LLM-as-Judge**
La valutazione basata su LLM scala a grandi set di test e fornisce giudizi consistenti. La chiave è progettare prompt di valutazione efficaci che catturino le dimensioni di interesse.

Fornisci descrizione chiara del task, output dell'agent, ground truth (se disponibile), scala di valutazione con descrizioni dei livelli, e richiedi giudizio strutturato.

**Valutazione umana**
La valutazione umana cattura ciò che l'automazione perde. Gli umani notano risposte allucinatorie su query inusuali, fallimenti di sistema e bias sottili che la valutazione automatica perde.

La valutazione umana efficace copre casi limite, campiona sistematicamente, traccia pattern e fornisce comprensione contestuale.

**Valutazione dello stato finale (End-State Evaluation)**
Per agent che mutano stato persistente, la valutazione dello stato finale si concentra su se lo stato finale corrisponde alle aspettative piuttosto che su come l'agent ci è arrivato.

### Design del set di test

**Selezione campioni**
Inizia con campioni piccoli durante lo sviluppo. All'inizio dello sviluppo dell'agent, i cambiamenti hanno impatti drammatici perché c'è abbondante low-hanging fruit. Set di test piccoli rivelano effetti grandi.

Campiona da pattern d'uso reali. Aggiungi casi limite noti. Assicura copertura tra livelli di complessità.

**Stratificazione per complessità**
I set di test dovrebbero coprire livelli di complessità: semplice (singola chiamata tool), medio (chiamate tool multiple), complesso (molte chiamate tool, ambiguità significativa), e molto complesso (interazione estesa, ragionamento profondo).

### Valutazione del Context Engineering

**Testing delle strategie di contesto**
Le scelte di context engineering dovrebbero essere validate attraverso valutazione sistematica. Esegui agent con diverse strategie di contesto sullo stesso set di test. Confronta punteggi qualità, utilizzo token e metriche di efficienza.

**Testing del degrado**
Testa come il degrado del contesto influenza la performance eseguendo agent a diverse dimensioni di contesto. Identifica cliff di performance dove il contesto diventa problematico. Stabilisci limiti operativi sicuri.

### Valutazione continua

**Pipeline di valutazione**
Costruisci pipeline di valutazione che girano automaticamente sui cambiamenti degli agent. Traccia risultati nel tempo. Confronta versioni per identificare miglioramenti o regressioni.

**Monitoraggio produzione**
Traccia metriche di valutazione in produzione campionando interazioni e valutando casualmente. Imposta alert per cali di qualità. Mantieni dashboard per analisi trend.

## Guida pratica

### Costruire framework di valutazione

1. Definisci dimensioni qualitative rilevanti per il tuo caso d'uso
2. Crea rubriche con descrizioni chiare e azionabili dei livelli
3. Costruisci set di test da pattern d'uso reali e casi limite
4. Implementa pipeline di valutazione automatizzate
5. Stabilisci metriche baseline prima di fare cambiamenti
6. Esegui valutazioni su tutti i cambiamenti significativi
7. Traccia metriche nel tempo per analisi trend
8. Integra valutazione automatica con review umana

### Evitare trabocchetti nella valutazione

- **Overfitting a percorsi specifici**: Valuta risultati, non step specifici
- **Ignorare casi limite**: Includi scenari di test diversi
- **Ossessione metrica singola**: Usa rubriche multi-dimensionali
- **Trascurare effetti contesto**: Testa con dimensioni contesto realistiche
- **Saltare valutazione umana**: La valutazione automatica perde problemi sottili

## Esempi

**Esempio 1: Valutazione semplice**
```python
def evaluate_agent_response(response, expected):
    rubric = load_rubric()
    scores = {}
    for dimension, config in rubric.items():
        scores[dimension] = assess_dimension(response, expected, dimension)
    overall = weighted_average(scores, config["weights"])
    return {"passed": overall >= 0.7, "scores": scores}
```

**Esempio 2: Struttura set di test**

I set di test dovrebbero coprire livelli multipli di complessità per assicurare valutazione comprensiva:

```python
test_set = [
    {
        "name": "simple_lookup",
        "input": "Qual è la capitale della Francia?",
        "expected": {"type": "fact", "answer": "Parigi"},
        "complexity": "simple",
        "description": "Singola chiamata tool, ricerca fattuale"
    },
    {
        "name": "medium_query",
        "input": "Confronta i ricavi di Apple e Microsoft dell'ultimo trimestre",
        "complexity": "medium",
        "description": "Chiamate tool multiple, logica di confronto"
    },
    {
        "name": "multi_step_reasoning",
        "input": "Analizza i dati di vendita da Q1 a Q4 e crea un report riassuntivo con trend",
        "complexity": "complex",
        "description": "Molte chiamate tool, aggregazione, analisi"
    },
    {
        "name": "research_synthesis",
        "input": "Ricerca tecnologie AI emergenti, valuta il loro impatto potenziale e raccomanda strategia di adozione",
        "complexity": "very_complex",
        "description": "Interazione estesa, ragionamento profondo, sintesi"
    }
]
```

## Linee guida

1. Usa rubriche multi-dimensionali, non metriche singole
2. Valuta risultati, non percorsi di esecuzione specifici
3. Copri livelli di complessità da semplice a complesso
4. Testa con dimensioni contesto e storie realistiche
5. Esegui valutazioni continuamente, non solo prima del rilascio
6. Integra valutazione LLM con review umana
7. Traccia metriche nel tempo per rilevamento trend
8. Imposta soglie pass/fail chiare basate sul caso d'uso

## Integrazione

Questa skill si connette a tutte le altre skill come preoccupazione trasversale:

- context-fundamentals - Valutare utilizzo contesto
- context-degradation - Rilevare degrado
- context-optimization - Misurare efficacia ottimizzazione
- multi-agent-patterns - Valutare coordinamento
- tool-design - Valutare efficacia tool
- memory-systems - Valutare qualità memoria

## Riferimenti

Riferimento interno:
- [Metrics Reference](./references/metrics.md) - Metriche di valutazione dettagliate e implementazione

---

## Metadata della Skill

**Creata**: 2025-12-20
**Ultimo aggiornamento**: 2026-02-12
**Autore**: Agent Skills for Context Engineering Contributors
**Versione**: 1.1.0
**Miglioramenti v1.1**: Description bilingue per migliore trigger, esempi in italiano, struttura ottimizzata
