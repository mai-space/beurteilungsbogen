import React, { useState } from 'react';
import './index.css';
import { CRITERIA, CATEGORIES, GRADE_LABELS } from './criteria';
import { buildShareUrl, parseShareUrl } from './shareUtils';
import { exportPdf } from './pdfExport';

// ── Step constants ──────────────────────────────────
const STEP_NAME = 1;
const STEP_SELF_GRADE = 2;
const STEP_SHARE = 3;
const STEP_COACH_GRADE = 4;
const STEP_RESULTS = 5;

// ── GradePicker ─────────────────────────────────────
function GradePicker({ value, onChange }) {
  return (
    <div className="grade-picker">
      {[1, 2, 3, 4, 5, 6].map((g) => (
        <button
          key={g}
          className={`grade-btn${value === g ? ' selected' : ''}`}
          title={GRADE_LABELS[g]}
          onClick={() => onChange(g)}
          type="button"
        >
          {g}
        </button>
      ))}
    </div>
  );
}

// ── StepDots ────────────────────────────────────────
const STEP_LABELS = ['Name', 'Selbst', 'Teilen', 'Coach', 'Ergebnis'];

function StepDots({ current }) {
  return (
    <div className="steps">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const cls =
          step < current ? 'step-dot done' : step === current ? 'step-dot active' : 'step-dot';
        return (
          <div key={step} className={cls} title={label}>
            {step < current ? '✓' : step}
          </div>
        );
      })}
    </div>
  );
}

// ── ProgressBar ─────────────────────────────────────
function ProgressBar({ graded, total }) {
  const pct = total === 0 ? 0 : Math.round((graded / total) * 100);
  return (
    <div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="muted" style={{ marginTop: -8, marginBottom: 16 }}>
        {graded} von {total} Kriterien bewertet
      </p>
    </div>
  );
}

// ── CategoryBlock ────────────────────────────────────
function CategoryBlock({ category, grades, onChange, compareGrades }) {
  const criteria = CRITERIA.filter((c) => c.category === category);
  return (
    <div className="category-block">
      <p className="category-title">{category}</p>
      {criteria.map((c) => (
        <div key={c.id} className="criterion-row">
          <div className="criterion-info">
            <div className="criterion-label">{c.label}</div>
            <div className="criterion-desc">{c.description}</div>
            {compareGrades && (
              <div style={{ marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span className="muted">
                  Selbst:{' '}
                  <span className={`grade-badge${compareGrades[c.id] ? '' : ' none'}`}>
                    {compareGrades[c.id] ?? '–'}
                  </span>
                </span>
                <span className="muted">
                  Coach:{' '}
                  <span className={`grade-badge${grades[c.id] ? '' : ' none'}`}>
                    {grades[c.id] ?? '–'}
                  </span>
                </span>
              </div>
            )}
          </div>
          <GradePicker value={grades[c.id] ?? null} onChange={(v) => onChange(c.id, v)} />
        </div>
      ))}
    </div>
  );
}

// ── ResultsTable ─────────────────────────────────────
function ResultsTable({ selfGrades, coachGrades }) {
  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Kriterium</th>
          <th style={{ textAlign: 'center' }}>Selbst</th>
          <th style={{ textAlign: 'center' }}>Coach</th>
        </tr>
      </thead>
      <tbody>
        {CATEGORIES.map((cat) => (
          <React.Fragment key={cat}>
            <tr className="cat-header">
              <td colSpan={3}>{cat}</td>
            </tr>
            {CRITERIA.filter((c) => c.category === cat).map((c) => (
              <tr key={c.id}>
                <td>{c.label}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`grade-badge${selfGrades[c.id] ? '' : ' none'}`}>
                    {selfGrades[c.id] ?? '–'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`grade-badge${coachGrades[c.id] ? '' : ' none'}`}>
                    {coachGrades[c.id] ?? '–'}
                  </span>
                </td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

const MAX_NAME_LENGTH = 100;

// ── Main App ─────────────────────────────────────────
function getInitialState() {
  const shared = parseShareUrl();
  if (shared) {
    window.history.replaceState(null, '', window.location.pathname);
    return {
      step: STEP_COACH_GRADE,
      name: shared.name ?? '',
      selfGrades: shared.grades ?? {},
      isCoachMode: true,
    };
  }
  return { step: STEP_NAME, name: '', selfGrades: {}, isCoachMode: false };
}

export default function App() {
  const [init] = useState(getInitialState);
  const [step, setStep] = useState(init.step);
  const [name, setName] = useState(init.name);
  const [selfGrades, setSelfGrades] = useState(init.selfGrades);
  const [coachGrades, setCoachGrades] = useState({});
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const isCoachMode = init.isCoachMode;

  const totalCriteria = CRITERIA.length;
  const selfGraded = Object.keys(selfGrades).length;
  const coachGraded = Object.keys(coachGrades).length;

  function handleSelfGrade(id, value) {
    setSelfGrades((prev) => ({ ...prev, [id]: value }));
  }

  function handleCoachGrade(id, value) {
    setCoachGrades((prev) => ({ ...prev, [id]: value }));
  }

  function handleGenerateShare() {
    const url = buildShareUrl({ name, grades: selfGrades });
    setShareUrl(url);
    setStep(STEP_SHARE);
  }

  async function handleCopy() {
    if (!navigator.clipboard?.writeText) {
      window.alert(
        'Kopieren in die Zwischenablage wird von Ihrem Browser nicht unterstützt. Bitte kopieren Sie den Link manuell.'
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.alert(
        'Der Link konnte nicht in die Zwischenablage kopiert werden. Bitte kopieren Sie ihn manuell.'
      );
    }
  }

  function handleExportPdf() {
    exportPdf(name, selfGrades, coachGrades);
  }

  // ── Render steps ──────────────────────────────────

  function renderStep() {
    switch (step) {
      // ── Step 1: Name ─────────────────────────────
      case STEP_NAME:
        return (
          <div>
            <h2 className="section-title">Willkommen zum Beurteilungsbogen</h2>
            <p className="muted" style={{ marginBottom: 20 }}>
              Bitte gib deinen Namen ein, um mit der Selbstbeurteilung zu beginnen.
            </p>
            <div className="form-group">
              <label htmlFor="name-input">Dein Name</label>
              <input
                id="name-input"
                type="text"
                placeholder="Vor- und Nachname"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(STEP_SELF_GRADE)}
                autoFocus
              />
            </div>
            <div className="btn-row">
              <button
                className="btn btn-primary"
                disabled={!name.trim()}
                onClick={() => setStep(STEP_SELF_GRADE)}
              >
                Weiter →
              </button>
            </div>
          </div>
        );

      // ── Step 2: Self-grading ──────────────────────
      case STEP_SELF_GRADE:
        return (
          <div>
            <h2 className="section-title">Selbsteinschätzung — {name}</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              Bewerte dich selbst in jedem Kriterium auf einer Skala von 1 (sehr gut) bis 6 (ungenügend).
            </p>
            <ProgressBar graded={selfGraded} total={totalCriteria} />
            {CATEGORIES.map((cat) => (
              <CategoryBlock
                key={cat}
                category={cat}
                grades={selfGrades}
                onChange={handleSelfGrade}
              />
            ))}
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setStep(STEP_NAME)}>
                ← Zurück
              </button>
              <button
                className="btn btn-primary"
                disabled={selfGraded < totalCriteria}
                onClick={handleGenerateShare}
                title={
                  selfGraded < totalCriteria
                    ? 'Bitte alle Kriterien bewerten'
                    : 'Link generieren'
                }
              >
                Link generieren →
              </button>
            </div>
          </div>
        );

      // ── Step 3: Share ─────────────────────────────
      case STEP_SHARE:
        return (
          <div>
            <h2 className="section-title">Ergebnisse teilen</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              Deine Selbsteinschätzung ist abgeschlossen! Teile den folgenden Link mit deinem Coach,
              damit er deine Bewertungen einsehen und gemeinsam mit dir besprechen kann.
            </p>
            <div className="share-box">
              <p>📎 Dein persönlicher Link</p>
              <div className="share-url-row">
                <input type="text" readOnly value={shareUrl} />
                <button className="btn btn-primary" onClick={handleCopy}>
                  {copied ? '✓ Kopiert' : 'Kopieren'}
                </button>
              </div>
              {copied && <p className="copied-msg" style={{ marginTop: 8, marginBottom: 0 }}>Link in die Zwischenablage kopiert!</p>}
            </div>
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setStep(STEP_SELF_GRADE)}>
                ← Zurück
              </button>
              <button className="btn btn-secondary" onClick={() => setStep(STEP_COACH_GRADE)}>
                Coach-Bewertung starten →
              </button>
            </div>
          </div>
        );

      // ── Step 4: Coach grading ──────────────────────
      case STEP_COACH_GRADE:
        return (
          <div>
            {isCoachMode && (
              <div className="coach-banner">
                🎓 Coach-Modus — Selbsteinschätzung von <strong style={{ marginLeft: 4 }}>{name}</strong>
              </div>
            )}
            <h2 className="section-title">Coach-Bewertung — {name}</h2>
            <p className="muted" style={{ marginBottom: 16 }}>
              Bewerte den/die Auszubildende/n in jedem Kriterium. Die Selbsteinschätzung ist zur
              Orientierung daneben sichtbar.
            </p>
            <ProgressBar graded={coachGraded} total={totalCriteria} />
            {CATEGORIES.map((cat) => (
              <CategoryBlock
                key={cat}
                category={cat}
                grades={coachGrades}
                onChange={handleCoachGrade}
                compareGrades={selfGrades}
              />
            ))}
            <div className="btn-row">
              {!isCoachMode && (
                <button className="btn btn-outline" onClick={() => setStep(STEP_SHARE)}>
                  ← Zurück
                </button>
              )}
              <button
                className="btn btn-accent"
                disabled={coachGraded < totalCriteria}
                onClick={() => setStep(STEP_RESULTS)}
                title={coachGraded < totalCriteria ? 'Bitte alle Kriterien bewerten' : ''}
              >
                Ergebnisse ansehen →
              </button>
            </div>
          </div>
        );

      // ── Step 5: Results ────────────────────────────
      case STEP_RESULTS:
        return (
          <div>
            <h2 className="section-title">Ergebnisse — {name}</h2>
            <p className="muted" style={{ marginBottom: 20 }}>
              Vergleich der Selbsteinschätzung und der Coach-Bewertung.
            </p>
            <ResultsTable selfGrades={selfGrades} coachGrades={coachGrades} />
            <div className="btn-row" style={{ marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setStep(STEP_COACH_GRADE)}>
                ← Zurück zur Bewertung
              </button>
              <button className="btn btn-primary" onClick={handleExportPdf}>
                📄 Als PDF exportieren
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Beurteilungsbogen</h1>
        <p>Selbstreflexion &amp; Beurteilung für Auszubildende</p>
      </header>
      <div className="card">
        <StepDots current={step} />
        {renderStep()}
      </div>
    </div>
  );
}
