# Helena & Sami ♥ v2
*retro arcade edition*

---

## What's inside

- 🔐 **Quiz gate** — rotating 3 questions per day from your bank. 2/3 correct to enter. Then a spin animation.
- ⏳ **Countdowns** — days only, top of page, pixel style
- ⏰ **Dual clock** — Helena (SGT) and Sami (editable from within the app)
- ▶ **Tasks** — "For Sami by Helena" and vice versa, based on who added it
- 🎬 **Watch list** — movies, shows, anime, docs
- ♠ **Bets** — track your bets, settle them when done
- ♥ **Thinking of You** — ping button with sarcastic responses

---

## Setup

### 1. Supabase
- Create a new project at supabase.com
- Go to SQL Editor → paste + run `supabase-schema.sql`
- Go to Project Settings → API → copy your Project URL and anon key

### 2. Environment variables
Create a `.env.local` file in the project root:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Add your quiz questions
Open `src/quizQuestions.js` — add as many questions as you want to `ALL_QUESTIONS`.
Every visit, **3 are randomly picked** (same 3 for both of you on the same day).
Change `PASS_SCORE` to set how many correct answers are needed to enter (default: 2).

### 4. Run locally
```bash
npm install
npm start
```

### 5. Deploy to Vercel
- Push to GitHub
- Import repo on vercel.com
- Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` as environment variables
- Deploy 🚀

---

## Tips

- **Sami's timezone**: tap the ✏ button on his clock to update it. Changes sync live.
- **Tasks**: who added it determines who it's "for" — Helena adds → "For Sami", Sami adds → "For Helena"
- **Bets**: mark as "settled" when one of you wins. Be honest.
- **Quiz**: update `ALL_QUESTIONS` in `src/quizQuestions.js` any time to add more questions.
