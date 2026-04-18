<!--
  Compila tutte le sezioni rilevanti.
  Le checkbox non spuntate non bloccano il merge ma servono come reminder.
-->

## 📝 Descrizione

<!-- Cosa fa questa PR? Perché serve? Link a issue se esiste (Closes #123). -->

## 🎯 Tipo di change

- [ ] 🚀 `feat` — nuova feature
- [ ] 🐛 `fix` — bug fix
- [ ] ♻️ `refactor` — refactoring senza change funzionali
- [ ] 🎨 `style` — formatting, no logica
- [ ] ⚡ `perf` — performance
- [ ] ✅ `test` — aggiunta/modifica test
- [ ] 📝 `docs` — solo documentazione
- [ ] 🔧 `chore` — build, deps, config
- [ ] 💥 **BREAKING CHANGE**

## 🔍 Come testare

<!--
  Step per riprodurre/verificare. Es:
  1. `npm run start:dev`
  2. POST /transaction con body { ... }
  3. Verifica risposta 201 + record su DB
-->

## 🗄 Database

- [ ] Aggiunge migrazione Prisma
- [ ] Modifica schema esistente (⚠️ verifica retrocompatibilità)
- [ ] Nessun impatto su DB

<!-- Se c'è migrazione, descrivi cosa cambia: -->

## ✅ Checklist

- [ ] Test aggiunti/aggiornati per le modifiche
- [ ] `npm run lint:check` passa
- [ ] `npm run typecheck` passa
- [ ] `npm run test` passa
- [ ] Endpoint nuovi documentati con `@ApiOperation` (Swagger)
- [ ] Variabili env nuove aggiunte a `.env.example`
- [ ] Nessun `console.log`, `.only`, `.skip` lasciato nei test

## 📸 Screenshot / Logs

<!-- Opzionale: screenshot Postman, log rilevanti, ecc. -->

## 🚀 Note per il deploy

<!--
  Se serve un'azione manuale post-deploy (env var nuova su Railway,
  migration da rieseguire, ecc.), scrivila qui.
-->

- [ ] Nessuna azione manuale richiesta
- [ ] Servono variabili d'ambiente nuove (specificare quali)
- [ ] Altro: ___
