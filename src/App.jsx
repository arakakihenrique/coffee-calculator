import { LanguageProvider, useLang } from './LanguageContext';
import BrewingCalculator from './components/BrewingCalculator';
import './App.css';

function Header() {
  const { lang, setLang, t } = useLang();
  return (
    <header className="app-header">
      <div className="lang-toggle">
        <button
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
        >
          EN
        </button>
        <button
          className={`lang-btn ${lang === 'pt' ? 'active' : ''}`}
          onClick={() => setLang('pt')}
        >
          PT
        </button>
      </div>
      <span className="header-icon">☕</span>
      <h1>{t('appTitle')}</h1>
      <p>{t('appSubtitle')}</p>
    </header>
  );
}

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Header />
        <main>
          <BrewingCalculator />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
