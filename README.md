# ☕ Coffee Calculator

A web app that helps you brew the perfect cup of coffee. Choose your brewing method, drink size, strength, roast level, and extraction speed — and get precise measurements for water, coffee grounds, temperature, grind size, and brew time.

For **Pour Over (V60)** lovers, there's also an interactive timer with a 5-stage pour schedule so you never lose track of your bloom and pours.

---

## Features

- **8 brewing methods** — Autodrip, AeroPress, Chemex, Cold Brew, French Press, Mokapot, Pour Over (V60), Siphon
- **Cascading filters** — options update dynamically based on your previous selections, so you only see valid combinations
- **Full recipe output** — water (ml), ground coffee (g), brew temperature, grind size, brew ratio, and total brew time
- **Pour Over Timer** — step-by-step pour schedule for V60 with a visual progress bar and real-time countdown
- **Bilingual** — English and Portuguese (PT-BR) support with a single-click toggle

---

## Preview

![Coffee Calculator Screenshot](src/assets/hero.png)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 |
| Build tool | Vite |
| Styling | Pure CSS (no framework) |
| i18n | Custom React Context |
| Data | 1,332 pre-computed recipes |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/arakakihenrique/coffee-calculator.git
cd coffee-calculator

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## How It Works

The app has a dataset of **1,332 recipes** (`src/data/coffeeData.js`) covering all combinations of brewing method, drink size, strength, roast level, and brew length. Each recipe contains:

```js
{
  brewingMethod: "Pour Over (V60)",
  drinkSize: "2 cups",
  strength: "Strong",
  roastLevel: "Medium Roast",
  brewLength: "Average",
  waterMl: 300,
  groundCoffeeG: 20,
  waterTemperature: "199 - 205°F",
  brewTime: "4 min",
  brewRatio: "1:15",
  grindSize: "Medium-Fine",
}
```

When all 5 parameters are selected, the app finds the matching entry and renders the result. Fahrenheit temperatures are converted to Celsius on the fly.

---

## Project Structure

```
src/
├── components/
│   ├── BrewingCalculator.jsx   # Main form with cascading selects
│   ├── BrewResult.jsx          # Recipe output display
│   ├── PourOverTimer.jsx       # Interactive V60 pour timer
│   └── SelectInput.jsx         # Reusable dropdown component
├── data/
│   └── coffeeData.js           # 1,332 recipe dataset
├── LanguageContext.jsx          # Global i18n context
├── i18n.js                     # EN/PT translations + label maps
├── App.jsx
└── main.jsx
```

---

## Pour Over Timer

When brewing with the V60 method, an interactive timer appears after the recipe is shown. It breaks the brew into 5 stages:

| Stage | Time | Water |
|---|---|---|
| Bloom | 0s | 50 ml |
| 1st Pour | 38s | 120 ml |
| 2nd Pour | 90s | 180 ml |
| 3rd Pour | 135s | 240 ml |
| Final Pour | 180s | 300 ml |

You can start, pause, resume, and reset the timer. The progress bar highlights the current stage and shows instructions as you go.

---

## Inspiration

Inspired by the [Coffee Bros Coffee-to-Water Ratio Calculator](https://coffeebros.com/pages/coffee-to-water-ratio-calculator).

---

## License

MIT
