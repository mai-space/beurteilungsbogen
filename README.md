# Beurteilungsbogen

A static React app for self-assessment and coaching evaluation of apprentices (*Auszubildende*).

## Features

- **Self-grading**: The apprentice enters their name and rates themselves on 8 criteria grouped into four competency areas (Fachkompetenz, Methodenkompetenz, Sozialkompetenz, Persönlichkeitskompetenz) using the German 1–6 grading scale.
- **Shareable link**: After completing the self-assessment, a URL is generated that encodes the results in the URL hash. The apprentice shares this link with their coach.
- **Coach grading**: When the coach opens the shared link, they are taken directly to the coach-grading view, where they can re-grade each criterion with the student's self-grades visible alongside.
- **PDF export**: The final combined result (self-grade + coach grade) can be exported as a PDF document for documentation and archiving.

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Grading Criteria

| Category | Criteria |
|---|---|
| Fachkompetenz | Arbeitsausführung, Lernbereitschaft |
| Methodenkompetenz | Arbeitsmethodik, Ordnung und Sauberkeit |
| Sozialkompetenz | Teamfähigkeit, Soziales Verhalten |
| Persönlichkeitskompetenz | Ausdauer, Belastbarkeit |

## Grading Scale

| Note | Bedeutung |
|---|---|
| 1 | Sehr gut |
| 2 | Gut |
| 3 | Befriedigend |
| 4 | Ausreichend |
| 5 | Mangelhaft |
| 6 | Ungenügend |
