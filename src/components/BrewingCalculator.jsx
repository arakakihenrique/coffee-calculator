import { useState, useMemo } from 'react';
import { coffeeData } from '../data/coffeeData';
import { useLang } from '../LanguageContext';
import { STRENGTH_LABELS, ROAST_LABELS, BREW_LENGTH_LABELS, translateDrinkSize } from '../i18n';
import SelectInput from './SelectInput';
import BrewResult from './BrewResult';

function BrewingCalculator() {
  const { lang, t } = useLang();
  const [method, setMethod] = useState('');
  const [drinkSize, setDrinkSize] = useState('');
  const [strength, setStrength] = useState('');
  const [roastLevel, setRoastLevel] = useState('');
  const [brewLength, setBrewLength] = useState('');

  const availableMethods = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const row of coffeeData) {
      if (!seen.has(row.brewingMethod)) { seen.add(row.brewingMethod); result.push(row.brewingMethod); }
    }
    return result;
  }, []);

  const availableDrinkSizes = useMemo(() => {
    if (!method) return [];
    const seen = new Set();
    const result = [];
    for (const row of coffeeData) {
      if (row.brewingMethod === method && !seen.has(row.drinkSize)) { seen.add(row.drinkSize); result.push(row.drinkSize); }
    }
    return result;
  }, [method]);

  const availableStrengths = useMemo(() => {
    if (!method) return [];
    const seen = new Set();
    const result = [];
    for (const row of coffeeData) {
      if (row.brewingMethod === method && !seen.has(row.strength)) { seen.add(row.strength); result.push(row.strength); }
    }
    return result;
  }, [method]);

  const availableRoastLevels = ['Light Roast', 'Medium Roast', 'Dark Roast'];
  const availableBrewLengths = ['Fast', 'Average', 'Slow'];

  const result = useMemo(() => {
    if (!method || !drinkSize || !strength || !roastLevel || !brewLength) return null;
    return coffeeData.find(
      (row) =>
        row.brewingMethod === method &&
        row.drinkSize === drinkSize &&
        row.strength === strength &&
        row.roastLevel === roastLevel &&
        row.brewLength === brewLength
    ) ?? null;
  }, [method, drinkSize, strength, roastLevel, brewLength]);

  function handleMethodChange(val) {
    setMethod(val); setDrinkSize(''); setStrength(''); setRoastLevel(''); setBrewLength('');
  }
  function handleDrinkSizeChange(val) { setDrinkSize(val); setRoastLevel(''); setBrewLength(''); }
  function handleStrengthChange(val) { setStrength(val); setRoastLevel(''); setBrewLength(''); }

  return (
    <div className="calculator-wrapper">
      <div className="calculator-card">
        <div className="card-title">
          <span className="card-title-icon">⚙️</span>
          {t('cardTitle')}
        </div>
        <SelectInput
          label={t('labelBrewingMethod')}
          value={method}
          onChange={handleMethodChange}
          options={availableMethods}
          placeholder={t('selectPlaceholder')}
          disabledPlaceholder={t('selectDisabled')}
        />
        <SelectInput
          label={t('labelDrinkSize')}
          value={drinkSize}
          onChange={handleDrinkSizeChange}
          options={availableDrinkSizes}
          disabled={!method}
          getLabel={(v) => translateDrinkSize(v, lang)}
          placeholder={t('selectPlaceholder')}
          disabledPlaceholder={t('selectDisabled')}
        />
        <SelectInput
          label={t('labelStrength')}
          value={strength}
          onChange={handleStrengthChange}
          options={availableStrengths}
          disabled={!method}
          getLabel={(v) => STRENGTH_LABELS[lang]?.[v] ?? v}
          placeholder={t('selectPlaceholder')}
          disabledPlaceholder={t('selectDisabled')}
        />
        <SelectInput
          label={t('labelRoastLevel')}
          value={roastLevel}
          onChange={(val) => { setRoastLevel(val); setBrewLength(''); }}
          options={availableRoastLevels}
          disabled={!drinkSize || !strength}
          getLabel={(v) => ROAST_LABELS[lang]?.[v] ?? v}
          placeholder={t('selectPlaceholder')}
          disabledPlaceholder={t('selectDisabled')}
        />
        <SelectInput
          label={t('labelBrewLength')}
          value={brewLength}
          onChange={setBrewLength}
          options={availableBrewLengths}
          disabled={!roastLevel}
          getLabel={(v) => BREW_LENGTH_LABELS[lang]?.[v] ?? v}
          placeholder={t('selectPlaceholder')}
          disabledPlaceholder={t('selectDisabled')}
        />
      </div>

      <BrewResult result={result} />
    </div>
  );
}

export default BrewingCalculator;
