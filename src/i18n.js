export const TRANSLATIONS = {
  en: {
    appTitle: 'Coffee Brewing Calculator',
    appSubtitle: 'Select your parameters to get the perfect recipe',
    cardTitle: 'Configure Your Brew',
    labelBrewingMethod: 'Brewing Method',
    labelDrinkSize: 'Drink Size',
    labelStrength: 'Strength',
    labelRoastLevel: 'Roast Level',
    labelBrewLength: 'Brew Length',
    selectPlaceholder: '-- Select --',
    selectDisabled: 'Select...',
    resultTitle: 'Your Brew Recipe',
    fieldTemperature: 'Temperature',
    fieldBrewRatio: 'Brew Ratio',
    fieldGrindSize: 'Grind Size',
    fieldWaterMl: 'Water (ml)',
    fieldBrewLength: 'Brew Length',
    statWater: 'Water',
    statCoffee: 'Coffee',
    statBrewTime: 'Brew Time',
    placeholderLine1: 'Fill in all five parameters',
    placeholderLine2: 'to see your brew recipe',
    timerTitle: 'Pour Schedule',
    timerBloom: 'Bloom · ',
    timerAddUntil: 'Add until',
    timerEndOfBrew: 'End of brew',
    timerBrewComplete: 'Brew complete!',
    timerReadyMain: (water) => `Pour until ${water}ml`,
    timerReadySub: 'Press Start when ready',
    timerNextSub: (time) => `Next pour at ${time}`,
    timerWaitSub: (time) => `Drip finishes at ${time}`,
    timerAdded: (water) => `${water}ml added`,
    labelBalance: 'Balance',
    balanceSweet: 'Sweet',
    balanceEven: 'Even',
    balanceBright: 'Bright',
    tabTimer: 'Timer',
    tabChart: 'Chart',
    btnStart: 'Start',
    btnPause: 'Pause',
    btnResume: 'Resume',
    btnReset: 'Reset',
    btnRestart: 'Restart',
  },
  pt: {
    appTitle: 'Calculadora de Café',
    appSubtitle: 'Selecione os parâmetros para a receita perfeita',
    cardTitle: 'Configure seu Preparo',
    labelBrewingMethod: 'Método de Preparo',
    labelDrinkSize: 'Volume',
    labelStrength: 'Intensidade',
    labelRoastLevel: 'Nível de Torra',
    labelBrewLength: 'Velocidade de Extração',
    selectPlaceholder: '-- Selecione --',
    selectDisabled: 'Selecione...',
    resultTitle: 'Sua Receita',
    fieldTemperature: 'Temperatura',
    fieldBrewRatio: 'Proporção',
    fieldGrindSize: 'Moagem',
    fieldWaterMl: 'Água (ml)',
    fieldBrewLength: 'Velocidade de Extração',
    statWater: 'Água',
    statCoffee: 'Café',
    statBrewTime: 'Tempo',
    placeholderLine1: 'Preencha os cinco parâmetros',
    placeholderLine2: 'para ver sua receita',
    timerTitle: 'Cronômetro de Despejo',
    timerBloom: 'Bloom · ',
    timerAddUntil: 'Despeje até',
    timerEndOfBrew: 'Fim do preparo',
    timerBrewComplete: 'Preparo completo!',
    timerReadyMain: (water) => `Despeje até ${water}ml`,
    timerReadySub: 'Pressione Iniciar quando estiver pronto',
    timerNextSub: (time) => `Próximo despejo às ${time}`,
    timerWaitSub: (time) => `Extração termina às ${time}`,
    timerAdded: (water) => `${water}ml adicionados`,
    labelBalance: 'Balanço',
    balanceSweet: 'Doce',
    balanceEven: 'Equilibrado',
    balanceBright: 'Brilhante',
    tabTimer: 'Timer',
    tabChart: 'Gráfico',
    btnStart: 'Iniciar',
    btnPause: 'Pausar',
    btnResume: 'Retomar',
    btnReset: 'Zerar',
    btnRestart: 'Recomeçar',
  },
};

// Display maps for CSV enum values
export const STRENGTH_LABELS = {
  en: { Mild: 'Mild', Average: 'Average', Strong: 'Strong', Robust: 'Robust' },
  pt: { Mild: 'Suave', Average: 'Médio', Strong: 'Forte', Robust: 'Robusto' },
};

export const ROAST_LABELS = {
  en: { 'Light Roast': 'Light Roast', 'Medium Roast': 'Medium Roast', 'Dark Roast': 'Dark Roast' },
  pt: { 'Light Roast': 'Torra Clara', 'Medium Roast': 'Torra Média', 'Dark Roast': 'Torra Escura' },
};

export const BREW_LENGTH_LABELS = {
  en: { Fast: 'Fast', Average: 'Average', Slow: 'Slow' },
  pt: { Fast: 'Rápido', Average: 'Médio', Slow: 'Lento' },
};

export const GRIND_LABELS = {
  en: {
    'Extra coarse': 'Extra coarse', 'Coarse': 'Coarse', 'Medium-coarse': 'Medium-coarse',
    'Medium': 'Medium', 'Medium-fine': 'Medium-fine', 'Fine': 'Fine', 'Extra fine': 'Extra fine',
  },
  pt: {
    'Extra coarse': 'Extra grossa', 'Coarse': 'Grossa', 'Medium-coarse': 'Média-grossa',
    'Medium': 'Média', 'Medium-fine': 'Média-fina', 'Fine': 'Fina', 'Extra fine': 'Extra fina',
  },
};

export function translateDrinkSize(size, lang) {
  if (lang === 'en') return size;
  return size.replace(/\b(\d+(?:[.,]\d+)?)\s+cups?\b/g, (_, n) => {
    const num = parseFloat(n.replace(',', '.'));
    return `${n} xícara${num !== 1 ? 's' : ''}`;
  });
}
