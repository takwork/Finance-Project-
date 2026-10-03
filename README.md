# Teen Money Lab

A free, interactive personal finance site for high school students, live at **[highschool-finance.com](https://highschool-finance.com/)**.

> **Learn money skills so you have more choices, less stress, and more freedom.**

Plain HTML, CSS, and JavaScript — no build step, no backend. Designed for phones first, with compact layouts on laptops.

---

## Open the site locally

Open `index.html` in any browser. Every page links to the others with relative links, so the whole site works straight from the folder.

To check phone layouts on a laptop, open `phone.html` (a local-only preview tool, not deployed) — it shows any page inside iPhone- and Pixel-sized frames.

---

## How the site is organized

12 lessons in four parts — **Earn, Save, Invest, Protect** — plus practice pages.

| Part | Lessons (in `learn/`) |
|------|------------------------|
| **Earn** | Jobs & Paychecks · Taxes Basics · Side Hustles |
| **Save** | Smart Money · Budgeting · Emergency Fund |
| **Invest** | Investment Types · What Is a Stock? · Compound Interest |
| **Protect** | Credit & Debt · Insurance · Scams & Identity Theft |

Every lesson has the same three sections:

1. **Learn** — the idea and a real-life example
2. **Try it** — a calculator or activity using your own numbers
3. **Check** — the one thing to remember, plus a quick question

On phones the sections stack as cards with a sticky section bar; on laptops they sit side by side.

A lesson counts as done when its quick check is answered correctly or you move on with **Next lesson**. Progress ("3 of 12 lessons") shows in the menu, on the All lessons page, and in the laptop header; it lasts for the browser tab and resets when the tab is closed. A moon/sun button in the header switches dark mode, and the choice is remembered.

Other pages: `lessons.html` (all lessons), `tools.html` (calculators and activities), `quiz.html` (12-question money quiz, one question at a time), `ask-ai.html` (copy-paste AI study prompts), `glossary.html` (searchable), `scenarios.html`, `about.html`, `feedback.html` (survey).

---

## File structure

```
index.html            homepage
lessons.html          all 12 lessons
tools.html, quiz.html, ask-ai.html, glossary.html,
scenarios.html, about.html, feedback.html
learn/*.html          the 12 lessons
assets/site.css       all styles (design tokens, layouts for phone and laptop)
assets/site.js        menu, lesson navigation, calculators, quick checks
favicon.svg, og-image.png, robots.txt, sitemap.xml
```

Old links from the previous single-page site (e.g. `/#make-jobs`) are redirected to the new pages by a small script in `index.html`.

---

## Tech

| Dependency | Source | Used for |
|------------|--------|----------|
| [Inter](https://fonts.google.com/specimen/Inter) | Google Fonts | Typography |
| [Tabler Icons](https://tabler.io/icons) | jsDelivr CDN | Icons |
| Google Analytics | googletagmanager.com | Page views and a few learning events |

No npm, bundler, or charting library. Hosted on Vercel — pushing to `main` deploys.

---

## Survey setup

The Feedback page embeds a Google Form once one exists: paste the form link into `GOOGLE_FORM_URL` in `feedback.html`. Until then the page shows "The survey isn't open yet."

---

## For teachers

Suggested 30–45 minute flow:

1. Open one lesson (e.g. **Invest → Compound Interest**)
2. Read **Learn** together
3. Let students move the sliders in **Try it** and discuss what changes
4. Finish with the **Check** question, then the Money Quiz

Content assumes no prior finance knowledge and avoids shaming students for where they start.

---

## Disclaimer

**Educational only — not financial advice.**

- Calculator numbers are estimates for learning
- No specific stocks, crypto, or products are recommended
- Students should talk with a parent, teacher, or trusted adult before real money decisions

---

## Author

**Taksh N**
