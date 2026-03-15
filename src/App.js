import React, { useState } from 'react'
import EntryGate from './components/EntryGate'
import DualClock from './components/DualClock'
import Countdowns from './components/Countdowns'
import SharedList from './components/SharedList'
import ThinkingOfYou from './components/ThinkingOfYou'
import './index.css'

export default function App() {
  const [entered, setEntered] = useState(false)
  if (!entered) return <EntryGate onEnter={() => setEntered(true)} />

  return (
    <div style={styles.app}>
      {/* Sky background clouds */}
      <div style={styles.cloudsBg} aria-hidden>
        {[
          { top: '3%', left: '8%', scale: 1 },
          { top: '7%', left: '55%', scale: 0.8 },
          { top: '1%', left: '35%', scale: 0.6 },
        ].map((c, i) => (
          <svg key={i} style={{ position: 'absolute', top: c.top, left: c.left, transform: `scale(${c.scale})`, opacity: 0.7 }} width="100" height="50" viewBox="0 0 100 50">
            <ellipse cx="50" cy="36" rx="44" ry="14" fill="white" />
            <ellipse cx="35" cy="26" rx="22" ry="17" fill="white" />
            <ellipse cx="65" cy="24" rx="20" ry="16" fill="white" />
          </svg>
        ))}
      </div>

      <header style={styles.header}>
        <div style={styles.titleRow}>
          <span style={{ fontSize: 40, animation: 'bounce 1s ease-in-out infinite' }}>🍄</span>
          <div>
            <h1 className="pixel-title" style={styles.title}>HELENA & SAMI</h1>
            <p style={styles.subtitle}>our little corner of the internet ⭐</p>
          </div>
          <span style={{ fontSize: 40, animation: 'bounce 1s ease-in-out infinite 0.3s' }}>⭐</span>
        </div>

        {/* Pixel divider */}
        <div style={styles.pixelDivider}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ ...styles.pixelBlock, background: i % 2 === 0 ? 'var(--yellow)' : 'var(--yellow-dark)' }} />
          ))}
        </div>
      </header>

      <main style={styles.main}>
        {/* COUNTDOWNS — top, full width */}
        <section style={{ ...styles.section, borderColor: 'var(--yellow-dark)', boxShadow: '0 5px 0 var(--yellow-dark)' }}>
          <Countdowns />
        </section>

        {/* CLOCKS */}
        <section style={{ ...styles.section, borderColor: 'var(--blue-dark)', boxShadow: '0 5px 0 var(--blue-dark)' }}>
          <DualClock />
        </section>

        {/* THINKING OF YOU */}
        <section style={{ ...styles.section, borderColor: 'var(--red-dark)', boxShadow: '0 5px 0 var(--red-dark)' }}>
          <ThinkingOfYou />
        </section>

        {/* TASKS — full width */}
        <section style={{ ...styles.section, borderColor: 'var(--red-dark)', boxShadow: '0 5px 0 var(--red-dark)' }}>
          <SharedList
            title="TASKS"
            icon="📋"
            table="todos"
            doneField="completed"
            placeholder="Add a task for the other one... 😈"
            accentColor="var(--red)"
            shadowColor="var(--red-dark)"
            emptyMsg="No tasks. One of you is slacking. 😴"
            emptyEmoji="💤"
            doneLabel="DONE"
          />
        </section>

        <div style={styles.twoCol}>
          {/* WATCH LIST */}
          <section style={{ ...styles.section, borderColor: 'var(--green-dark)', boxShadow: '0 5px 0 var(--green-dark)' }}>
            <SharedList
              title="WATCH LIST"
              icon="🎬"
              table="watchlist"
              doneField="watched"
              placeholder="Movie or show to watch..."
              typeOptions={['Movie', 'TV Show', 'Anime', 'Documentary']}
              accentColor="var(--green)"
              shadowColor="var(--green-dark)"
              emptyMsg="Nothing to watch. Pick something. 🍿"
              emptyEmoji="🍿"
              doneLabel="WATCHED"
            />
          </section>

          {/* BETS */}
          <section style={{ ...styles.section, borderColor: 'var(--brown)', boxShadow: '0 5px 0 var(--brown)' }}>
            <SharedList
              title="BETS"
              icon="🎲"
              table="bets"
              doneField="won"
              placeholder="What's the bet...?"
              accentColor="var(--brown)"
              shadowColor="#5c2d0a"
              emptyMsg="No bets yet. Someone's scared. 🐔"
              emptyEmoji="🐔"
              doneLabel="SETTLED"
            />
          </section>
        </div>
      </main>

      {/* Ground */}
      <div style={styles.groundWrap}>
        <div style={styles.pixelDivider}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ ...styles.pixelBlock, background: i % 2 === 0 ? 'var(--green)' : 'var(--green-dark)' }} />
          ))}
        </div>
        <div style={styles.ground}>
          {['🌿', '🍄', '🌿', '⭐', '🌿', '🍄', '🌿', '🌿', '⭐', '🌿'].map((e, i) => (
            <span key={i} style={{ fontSize: 20 }}>{e}</span>
          ))}
        </div>
        <p style={styles.footer}>
          made with ❤️ for helena & sami
        </p>
      </div>
    </div>
  )
}

const styles = {
  app: { maxWidth: 900, margin: '0 auto', padding: '0 16px', position: 'relative' },
  cloudsBg: { position: 'fixed', top: 0, left: 0, right: 0, height: 120, pointerEvents: 'none', zIndex: 0 },
  header: { textAlign: 'center', padding: '32px 0 20px', position: 'relative', zIndex: 1 },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 },
  title: { fontSize: 'clamp(12px, 3vw, 20px)', color: 'var(--red)', textShadow: '3px 3px 0 var(--red-dark)', marginBottom: 6 },
  subtitle: { fontSize: 16, color: 'var(--text2)', fontWeight: 700 },
  pixelDivider: { display: 'flex', height: 16, overflow: 'hidden' },
  pixelBlock: { flex: 1, minWidth: 0 },
  main: { display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 8, position: 'relative', zIndex: 1 },
  section: { background: 'var(--white)', borderRadius: 16, border: '3px solid', padding: 20 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  groundWrap: { position: 'relative', zIndex: 1, marginTop: 24 },
  ground: { background: 'var(--green)', padding: '8px 16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  footer: { background: 'var(--green-dark)', textAlign: 'center', padding: '10px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }
}
