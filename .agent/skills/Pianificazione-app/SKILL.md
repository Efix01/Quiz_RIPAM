---
name: Pianificazione-app
description: "Use this BEFORE implementation or creative coding when the user asks to plan/design/spec a feature, component, refactor, workflow, or app change (pianificare, progettare, definire requisiti, architettura, specifiche). Produces a validated design + doc template + readiness checklist."
---

# Brainstorming Ideas Into Designs (Pianificazione → Specifiche)

## Obiettivo
Trasformare un’idea in un design verificato e implementabile tramite dialogo collaborativo, riducendo ambiguità e overengineering (YAGNI).

## Trigger rapidi (esempi di richieste)
Usa questa skill quando l’utente scrive o intende qualcosa come:
- "Progetta / pianifica una nuova funzionalità per..."
- "Mi fai le specifiche per..."
- "Definiamo l’architettura / i componenti di..."
- "Vorrei aggiungere/modificare il comportamento di..."
- "Serve un piano prima di implementare..."
- "Come faccio a refactorare X senza rompere Y?"
- "Crea una roadmap / design doc per..."

Se l’utente chiede direttamente codice senza requisiti chiari, attiva comunque questa skill e proponi una fase di design minima.

## Prima: contesto progetto (efficienza)
1) Verifica lo stato del progetto (file, docs, commit recenti) **se disponibile**.
2) Se non puoi vedere repo/file/commit, chiedi all’utente di incollare:
- breve descrizione dell’obiettivo
- vincoli (tempi, dipendenze, stack)
- link o estratti dei file rilevanti
- criteri di successo misurabili

## Il processo (una domanda alla volta)
### 1) Comprendere l’idea
- Fai domande una alla volta.
- Preferisci scelta multipla quando possibile.
- Copri: scopo, vincoli, criteri di successo, non-obiettivi (non-goals).

### 2) Esplorare approcci
- Proponi 2–3 approcci con trade-off.
- Parti con quello raccomandato e spiega perché.
- Applica YAGNI in modo esplicito: taglia feature non necessarie.

### 3) Presentare il design (a sezioni)
Quando pensi di aver capito cosa costruire, presenta il design in sezioni da 200–300 parole.
Dopo ogni sezione chiedi: "Va bene fin qui?"

Copri almeno:
- Architettura (alto livello).
- Componenti / moduli.
- Flusso dati (ingressi, trasformazioni, output).
- Error handling (casi attesi e fallimenti).
- Testing (unit, integrazione, casi limite).
- Migrazione/compatibilità (se applicabile).

## Output: template del Design Doc (punto 2)
Quando il design è validato, scrivilo in:
`docs/plans/YYYY-MM-DD-<topic>-design.md`

Usa questo template:

# <Titolo: topic>
Data: YYYY-MM-DD
Owner: <nome>
Stato: Draft | Validato | In implementazione

## 1. Contesto
- Problema da risolvere:
- Perché ora:
- Stakeholder/utenti:

## 2. Obiettivi e non-obiettivi
- Obiettivi:
- Non-obiettivi (espliciti):

## 3. Requisiti
- Funzionali:
- Non funzionali (performance, sicurezza, compatibilità, accessibilità, ecc.):
- Vincoli (tempo, budget, stack, policy):

## 4. Assunzioni e dipendenze
- Assunzioni:
- Dipendenze:
- Rischi:

## 5. Approcci considerati
### Opzione A (raccomandata)
- Pro:
- Contro:
### Opzione B
- Pro:
- Contro:
### Opzione C (se serve)
- Pro:
- Contro:

## 6. Design proposto
- Architettura:
- Componenti:
- Data flow:
- Error handling:
- Observability/logging (se applicabile):

## 7. Piano test
- Unit test:
- Integration/E2E:
- Casi limite:

## 8. Piano di rollout
- Migrazione dati (se serve):
- Feature flag/rollback:
- Misure di successo:

## 9. TODO aperti
- Domande non risolte:
- Decisioni da confermare:

## Dopo il design (commit e prossimi passi)
**Documentazione:**
- Scrivi il design validato in `docs/plans/YYYY-MM-DD-<topic>-design.md`.
- Usa `elements-of-style:writing-clearly-and-concisely` se disponibile.
- Commit su git del documento.

**Implementazione (se si prosegue):**
- Chiedi: "Ready to set up for implementation?"
- Usa `superpowers:using-git-worktrees` per creare workspace isolato.
- Usa `superpowers:writing-plans` per creare un piano dettagliato.

## Checklist di efficienza e completezza (punto 3)
Prima di dire “design pronto”, verifica:
- I requisiti sono testabili (c’è almeno 1 criterio di successo misurabile).
- I non-obiettivi sono espliciti (cosa NON faremo).
- È stato scelto 1 approccio con motivazione e trade-off.
- Architettura e componenti sono sufficientemente dettagliati per iniziare.
- Il flusso dati è chiaro (input → trasformazioni → output).
- Sono coperti errori e fallback (almeno i casi principali).
- Esiste un piano test minimo (unit + integrazione).
- È definito rollout/rollback se c’è rischio di regressioni.
- YAGNI applicato: nessuna feature “nice to have” non giustificata.

## Principi chiave
- Una domanda alla volta.
- Scelta multipla preferita.
- YAGNI spietato.
- Esplora alternative.
- Validazione incrementale.
- Flessibilità: torna indietro e chiarisci quando qualcosa non torna.
