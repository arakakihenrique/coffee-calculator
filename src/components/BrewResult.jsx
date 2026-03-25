import { useLang } from '../LanguageContext';
import { STRENGTH_LABELS, ROAST_LABELS, BREW_LENGTH_LABELS, GRIND_LABELS, translateDrinkSize } from '../i18n';
import PourOverTimer from './PourOverTimer';

function fahrenheitRangeToCelsius(tempStr) {
  if (!tempStr || !tempStr.includes('°F')) return tempStr;
  const range = tempStr.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)°F/);
  if (range) {
    const lo = Math.round((parseFloat(range[1]) - 32) * 5 / 9);
    const hi = Math.round((parseFloat(range[2]) - 32) * 5 / 9);
    return `${lo} – ${hi}°C`;
  }
  const single = tempStr.match(/(\d+(?:\.\d+)?)°F/);
  if (single) return `${Math.round((parseFloat(single[1]) - 32) * 5 / 9)}°C`;
  return tempStr;
}

function BrewResult({ result }) {
  const { lang, t } = useLang();

  if (!result) {
    return (
      <div className="brew-result-wrapper">
        <div className="result-placeholder">
          <span className="placeholder-icon">☕</span>
          <p>{t('placeholderLine1')}<br />{t('placeholderLine2')}</p>
        </div>
      </div>
    );
  }

  const tempCelsius = fahrenheitRangeToCelsius(result.waterTemperature);

  return (
    <div className="brew-result-wrapper">
      <div className="brew-result-card">
        <div className="result-header">
          <div className="result-label">{t('resultTitle')}</div>
          <div className="result-method-name">{result.brewingMethod}</div>
          <div className="result-subtitle">
            {translateDrinkSize(result.drinkSize, lang)}
            &nbsp;&middot;&nbsp;
            {STRENGTH_LABELS[lang]?.[result.strength] ?? result.strength}
            &nbsp;&middot;&nbsp;
            {ROAST_LABELS[lang]?.[result.roastLevel] ?? result.roastLevel}
          </div>
        </div>

        <div className="result-stats">
          <div className="stat-block">
            <span className="stat-emoji">💧</span>
            <span className="stat-value">{result.waterMl}ml</span>
            <span className="stat-label">{t('statWater')}</span>
          </div>
          <div className="stat-block">
            <span className="stat-emoji">🫘</span>
            <span className="stat-value">{result.groundCoffeeG}g</span>
            <span className="stat-label">{t('statCoffee')}</span>
          </div>
          <div className="stat-block">
            <span className="stat-emoji">⏱</span>
            <span className="stat-value">{result.brewTime}</span>
            <span className="stat-label">{t('statBrewTime')}</span>
          </div>
        </div>

        <div className="result-details">
          <div className="detail-row">
            <span className="detail-label">{t('fieldTemperature')}</span>
            <span className="detail-value">{tempCelsius}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('fieldBrewRatio')}</span>
            <span className="detail-value">{result.brewRatio}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('fieldGrindSize')}</span>
            <span className="detail-value">{GRIND_LABELS[lang]?.[result.grindSize] ?? result.grindSize}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('fieldBrewLength')}</span>
            <span className="detail-value">{BREW_LENGTH_LABELS[lang]?.[result.brewLength] ?? result.brewLength}</span>
          </div>
        </div>
      </div>

      {result.brewingMethod === 'Pour Over (V60)' && (
        <PourOverTimer result={result} />
      )}
    </div>
  );
}

export default BrewResult;
