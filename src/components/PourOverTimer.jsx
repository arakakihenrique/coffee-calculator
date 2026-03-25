import { useState, useEffect } from 'react';
import { useLang } from '../LanguageContext';

const STRENGTH_TIME_RATIOS = {
  Mild:    [0, 45/210, 90/210, 150/210],
  Average: [0, 38/210, 90/210, 135/210, 180/210],
  Strong:  [0, 45/210, 90/210, 120/210, 150/210, 180/210],
  Robust:  [0, 45/210, 90/210, 114/210, 138/210, 162/210, 186/210],
};

const BALANCE_FIRST_STAGE_RATIO = {
  sweet:  0.41,
  even:   0.50,
  bright: 0.59,
};

function computeWaterIncrements(balance, n) {
  const firstRatio = BALANCE_FIRST_STAGE_RATIO[balance] ?? 0.50;
  const increments = [firstRatio * 0.40, (1 - firstRatio) * 0.40];
  const perRemaining = 0.60 / (n - 2);
  for (let i = 2; i < n; i++) increments.push(perRemaining);
  return increments;
}

function buildStages(totalSecs, totalWater, strength, balance) {
  const timeRatios = STRENGTH_TIME_RATIOS[strength] ?? STRENGTH_TIME_RATIOS.Average;
  const n = timeRatios.length;
  const increments = computeWaterIncrements(balance, n);
  let cumWater = 0;
  return timeRatios.map((tr, i) => {
    cumWater += increments[i] * totalWater;
    return {
      time: Math.round(totalSecs * tr),
      water: Math.round(cumWater),
      pour: Math.round(increments[i] * totalWater),
    };
  });
}

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

function StagesChart({ stages }) {
  const maxPour = Math.max(...stages.map(s => s.pour));
  const svgW = 300;
  const svgH = 180;
  const padL = 36;
  const padR = 12;
  const padT = 20;
  const padB = 36;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const n = stages.length;
  const barW = Math.min(32, (chartW / n) * 0.55);
  const gap = chartW / n;

  const yTicks = 4;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="stages-chart-svg"
      aria-hidden="true"
    >
      {/* Y gridlines + labels */}
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const val = Math.round((maxPour * i) / yTicks);
        const y = padT + chartH - (chartH * i) / yTicks;
        return (
          <g key={i}>
            <line
              x1={padL} y1={y} x2={padL + chartW} y2={y}
              stroke="#e8d9c8" strokeWidth={i === 0 ? 1.5 : 0.8}
            />
            <text
              x={padL - 5} y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#9c7a5a"
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {stages.map((stage, i) => {
        const barH = maxPour > 0 ? (stage.pour / maxPour) * chartH : 0;
        const x = padL + gap * i + gap / 2 - barW / 2;
        const y = padT + chartH - barH;
        const isFirst = i === 0;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx={4}
              fill={isFirst ? '#c17b3e' : '#d6a06a'}
              opacity={0.9}
            />
            {/* Pour value above bar */}
            <text
              x={x + barW / 2}
              y={y - 4}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#5a3e2b"
            >
              {stage.pour}
            </text>
            {/* Stage label below */}
            <text
              x={x + barW / 2}
              y={padT + chartH + 14}
              textAnchor="middle"
              fontSize="10"
              fill="#9c7a5a"
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Y axis label */}
      <text
        x={10}
        y={padT + chartH / 2}
        textAnchor="middle"
        fontSize="9"
        fill="#9c7a5a"
        transform={`rotate(-90, 10, ${padT + chartH / 2})`}
      >
        ml
      </text>

      {/* X axis label */}
      <text
        x={padL + chartW / 2}
        y={svgH - 2}
        textAnchor="middle"
        fontSize="9"
        fill="#9c7a5a"
      >
        stage
      </text>
    </svg>
  );
}

export default function PourOverTimer({ result }) {
  const { t } = useLang();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [balance, setBalance] = useState('sweet');
  const [tab, setTab] = useState('timer');

  const totalSecs = parseBrewTimeToSecs(result.brewTime);
  const totalWater = result.waterMl;
  const strength = result.strength ?? 'Average';

  useEffect(() => {
    setElapsed(0);
    setRunning(false);
  }, [result.brewTime, result.waterMl]);

  const stages = buildStages(totalSecs, totalWater, strength, balance);

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

      <div className="timer-balance-row">
        <label className="timer-balance-label">{t('labelBalance')}</label>
        <select
          className="timer-balance-select"
          value={balance}
          onChange={e => setBalance(e.target.value)}
        >
          <option value="sweet">{t('balanceSweet')}</option>
          <option value="even">{t('balanceEven')}</option>
          <option value="bright">{t('balanceBright')}</option>
        </select>
      </div>

      <div className="timer-tabs">
        <button
          className={`timer-tab ${tab === 'timer' ? 'active' : ''}`}
          onClick={() => setTab('timer')}
        >
          {t('tabTimer')}
        </button>
        <button
          className={`timer-tab ${tab === 'chart' ? 'active' : ''}`}
          onClick={() => setTab('chart')}
        >
          {t('tabChart')}
        </button>
      </div>

      {tab === 'timer' ? (
        <>
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
        </>
      ) : (
        <div className="timer-chart-tab">
          <StagesChart stages={stages} />
        </div>
      )}
    </div>
  );
}
