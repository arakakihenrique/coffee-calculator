import { useState, useEffect } from 'react';
import { useLang } from '../LanguageContext';

const STAGE_RATIOS = [
  { timeRatio: 0,        waterRatio: 50 / 300 },
  { timeRatio: 38 / 210, waterRatio: 120 / 300 },
  { timeRatio: 90 / 210, waterRatio: 180 / 300 },
  { timeRatio: 135 / 210, waterRatio: 240 / 300 },
  { timeRatio: 180 / 210, waterRatio: 300 / 300 },
];

function parseBrewTimeToSecs(brewTime) {
  if (!brewTime) return null;
  const minSec = brewTime.match(/(\d+)\s*min(?:\s*(\d+)\s*sec)?/i);
  if (minSec) return parseInt(minSec[1]) * 60 + (minSec[2] ? parseInt(minSec[2]) : 0);
  const mmss = brewTime.match(/^(\d+):(\d{2})$/);
  if (mmss) return parseInt(mmss[1]) * 60 + parseInt(mmss[2]);
  return null;
}

function formatSecs(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PourOverTimer({ result }) {
  const { t } = useLang();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const totalSecs = parseBrewTimeToSecs(result.brewTime);
  const totalWater = result.waterMl;

  useEffect(() => {
    setElapsed(0);
    setRunning(false);
  }, [result.brewTime, result.waterMl]);

  const stages = STAGE_RATIOS.map(({ timeRatio, waterRatio }) => ({
    time: Math.round(totalSecs * timeRatio),
    water: Math.round(totalWater * waterRatio),
  }));

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && elapsed >= totalSecs) setRunning(false);
  }, [elapsed, running, totalSecs]);

  const isFinished = elapsed >= totalSecs;

  let currentStageIdx = 0;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (elapsed >= stages[i].time) { currentStageIdx = i; break; }
  }
  const nextStage = stages[currentStageIdx + 1];

  function handleToggle() {
    if (isFinished) { setElapsed(0); setRunning(true); }
    else setRunning(prev => !prev);
  }
  function handleReset() { setRunning(false); setElapsed(0); }

  if (!totalSecs) return null;

  let instructionMain, instructionSub;
  if (isFinished) {
    instructionMain = t('timerBrewComplete');
    instructionSub = null;
  } else if (elapsed === 0 && !running) {
    instructionMain = t('timerReadyMain')(stages[0].water);
    instructionSub = t('timerReadySub');
  } else if (!nextStage) {
    instructionMain = t('timerAdded')(stages[currentStageIdx].water);
    instructionSub = t('timerWaitSub')(formatSecs(totalSecs));
  } else {
    instructionMain = t('timerReadyMain')(stages[currentStageIdx].water);
    instructionSub = t('timerNextSub')(formatSecs(nextStage.time));
  }

  const progress = Math.min(elapsed / totalSecs, 1);

  let startLabel;
  if (isFinished) startLabel = t('btnRestart');
  else if (running) startLabel = t('btnPause');
  else if (elapsed > 0) startLabel = t('btnResume');
  else startLabel = t('btnStart');

  return (
    <div className="pour-timer-card">
      <div className="timer-header">
        <span className="timer-title">{t('timerTitle')}</span>
        <span className="timer-method-tag">V60</span>
      </div>

      <div className="timer-progress-bar">
        <div className="timer-progress-fill" style={{ width: `${progress * 100}%` }} />
        {stages.map((stage, i) => {
          const pct = (stage.time / totalSecs) * 100;
          const nextTime = i + 1 < stages.length ? stages[i + 1].time : totalSecs;
          const done = elapsed >= nextTime;
          const active = !done && elapsed >= stage.time;
          return (
            <div
              key={i}
              className={`progress-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}
              style={{ left: `${pct}%` }}
            >
              <div className="progress-step-dot" />
              <div className="progress-step-label">{i + 1}</div>
            </div>
          );
        })}
        <div className={`progress-step ${isFinished ? 'done' : ''}`} style={{ left: '100%' }}>
          <div className="progress-step-dot end" />
        </div>
      </div>

      <div className="timer-body">
        <div className="timer-clock-col">
          <div className={`timer-clock ${isFinished ? 'finished' : running ? 'ticking' : ''}`}>
            {formatSecs(elapsed)}
          </div>
          <div className="timer-total-label">/ {formatSecs(totalSecs)}</div>
        </div>
        <div className="timer-instruction-col">
          <div className={`timer-instruction-main ${isFinished ? 'finished' : ''}`}>
            {instructionMain}
          </div>
          {instructionSub && (
            <div className="timer-instruction-sub">{instructionSub}</div>
          )}
        </div>
      </div>

      <ol className="timer-stages">
        {stages.map((stage, i) => {
          const nextTime = i + 1 < stages.length ? stages[i + 1].time : totalSecs;
          const done = elapsed >= nextTime;
          const active = !done && elapsed >= stage.time;
          return (
            <li key={i} className={`timer-stage ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              <span className="stage-indicator">{done ? '✓' : active ? '▶' : String(i + 1)}</span>
              <span className="stage-time">{formatSecs(stage.time)}</span>
              <span className="stage-desc">
                {i === 0 && <span className="stage-tag">{t('timerBloom')}</span>}
                {t('timerAddUntil')} <strong>{stage.water}ml</strong>
              </span>
            </li>
          );
        })}
        <li className={`timer-stage ${isFinished ? 'done' : ''}`}>
          <span className="stage-indicator">{isFinished ? '✓' : '◻'}</span>
          <span className="stage-time">{formatSecs(totalSecs)}</span>
          <span className="stage-desc">{t('timerEndOfBrew')}</span>
        </li>
      </ol>

      <div className="timer-controls">
        <button className="timer-btn-primary" onClick={handleToggle}>{startLabel}</button>
        <button
          className="timer-btn-secondary"
          onClick={handleReset}
          disabled={elapsed === 0 && !running}
        >
          {t('btnReset')}
        </button>
      </div>
    </div>
  );
}
