# Teen Money Lab

[`teen-money-lab.html`](teen-money-lab.html) is a single-file, interactive personal finance site for high school students (grades 9–12). Open it in any browser — no install, no build step.

> **Learn money skills so you have more choices, less stress, and more freedom.**

---

## Open the site

**Locally:** double-click `teen-money-lab.html`, or:

```bash
open teen-money-lab.html          # macOS
xdg-open teen-money-lab.html      # Linux
start teen-money-lab.html         # Windows
```

**GitHub Pages:** copy to `index.html`, push, and enable Pages on your repo root. See [Publish](#publish-on-github-pages).

---

## How the site is organized

The header has four tabs. Each tab opens a section with its own topic navigation.

```
Earn → Save → Invest → Concepts
```

| Tab | Core message | Topics |
|-----|--------------|--------|
| **Earn** | Your pay goes up when your skills go up. | What could I earn?, Side hustles, First paycheck 101, Quiz |
| **Save** | Saving = more choices later. | Budget builder, Emergency stash, Save for something, Quiz |
| **Save → Money hygiene** | *(under Save tab)* | Credit score 101, Scams & identity theft, Good debt vs. bad debt |
| **Invest** | Start early, stay patient — time is your superpower. | Investment types, How money grows, Your money at work, Risk vs. reward, Quiz |
| **Concepts** | Deep-dive explainers with quizzes. | What is a stock?, Why credit history matters, What is compound interest?, The rule of 72 |

---

## Interactive tools

All calculators use sliders and dropdowns — results update live.

### Earn
| Tool | What it does |
|------|----------------|
| **Skill-to-Income Calculator** | Pick a skill (or custom rate) + hours/week → hourly, monthly, yearly, and 4-year income |
| **Side hustles** | Clickable cards for tutoring, video editing, design, babysitting, social media, coding |
| **First paycheck 101** | Gross pay slider → estimated taxes withheld and take-home pay |

### Save
| Tool | What it does |
|------|----------------|
| **Budget Builder** | Monthly income + savings % → monthly savings, needs/wants split, annual total |
| **Emergency stash** | Monthly expenses + savings rate → 3- and 6-month targets, months to reach |
| **Savings goals** | Goal amount + monthly savings → months to reach and target date |
| **Credit score simulator** | Score slider (300–850) → rating, estimated car loan rate, extra interest cost |
| **Credit card payoff** | Balance + minimum payment → total interest, payoff time |

### Invest
| Tool | What it does |
|------|----------------|
| **Investment types** | Filterable asset grid (savings, index funds, bonds, stocks, crypto) with detail panels |
| **Risk/return chart** | Bubble chart plotting risk vs. approximate return (Chart.js) |
| **Compound interest** | Starting amount, monthly contribution, years, return % → contributed vs. growth + line chart |
| **Your money at work** | Side-by-side bars: money you put in vs. money earned from growth |
| **Risk vs. reward** | Tap savings, bonds, index funds, single stocks, or crypto to see profiles |

### Quizzes
Each of Earn, Save, and Invest includes multiple-choice quizzes with explanations after you answer. Concepts includes inline quiz questions too.

---

## File structure

Everything lives in one file:

```
teen-money-lab.html
├── <style>     … all CSS (design tokens, layout, components)
├── HTML        … header, landing hero, 4 panels, footer
└── <script>    … navigation, calculators, Chart.js charts, quizzes
```

There are no separate CSS, JS, or asset files.

---

## Tech stack

| Dependency | Source | Used for |
|------------|--------|----------|
| [Inter](https://fonts.google.com/specimen/Inter) | Google Fonts | Typography |
| [Tabler Icons](https://tabler.io/icons) | jsDelivr CDN | Icons |
| [Chart.js 4.4](https://www.chartjs.org/) | jsDelivr CDN | Compound growth line chart, risk/return bubble chart |

No npm, bundler, or backend. Works offline after first load (CDN fonts/icons may need network once).

---

## Design

- Sticky header with blurred glass effect
- Gradient landing hero with four pillar buttons
- Color-coded sections: green (Earn), blue (Save), teal (Invest), purple (Concepts)
- Risk colors: blue (low), amber (medium), red (high), purple (speculative)
- Responsive layout — pillar grid and topic nav adapt on mobile

---

## Publish on GitHub Pages

```bash
cp teen-money-lab.html index.html
git add index.html
git commit -m "Add index.html for GitHub Pages"
git push
```

Repo → **Settings → Pages** → deploy from `main` branch, `/ (root)`.

Site URL: `https://YOUR_USERNAME.github.io/personal_finance/`

---

## For teachers

Suggested 30–45 minute flow:

1. Open one tab (e.g. **Invest → How money grows**)
2. Let students move the sliders and discuss what changes
3. Read the “Real talk” or reflection prompt together
4. Finish with the section quiz

Content assumes no prior finance knowledge and avoids shaming students for where they start.

---

## Disclaimer

**Educational only — not financial advice.**

- Calculator numbers are estimates for learning
- No specific stocks, crypto, or products are recommended
- Students should talk with a parent, teacher, or trusted adult before real money decisions

---

## Author
TakN
