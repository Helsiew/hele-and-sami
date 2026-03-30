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
      <header style={styles.header}>
        <div style={styles.headerBg} aria-hidden />
        <div style={styles.titleRow}>
          <img src="/helena.png" alt="Helena" style={{ ...styles.headerAvatar, animationDelay: '0s' }} />
          <div>
            <h1 className="pixel-title" style={styles.title}>HELENA & SAMI</h1>
            <p style={styles.subtitle}>⭐ our little corner of the internet ⭐</p>
          </div>
          <img src="/sami.png" alt="Sami" style={{ ...styles.headerAvatar, animationDelay: '0.3s' }} />
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
        <section style={{ ...styles.section, borderColor: '#3b0764', boxShadow: '0 5px 0 #3b0764' }}>
          <ThinkingOfYou />
        </section>

        {/* TASKS — full width */}
        <section style={{ ...styles.section, borderColor: 'var(--red-dark)', boxShadow: '0 5px 0 var(--red-dark)' }}>
          <SharedList
            title="OUR SIDE QUEST"
            icon="📋"
            table="todos"
            doneField="completed"
            placeholder="Add a task for the other one... 😈"
            accentColor="var(--red)"
            shadowColor="var(--red-dark)"
            emptyMsg="No tasks. One of you is slacking. 😴"
            emptyEmoji="💤"
            doneLabel="DONE"
            pageLimit={4}
          />
        </section>

        <div style={styles.twoCol}>
          {/* WATCH LIST */}
          <section style={{ ...styles.section, borderColor: 'var(--green-dark)', boxShadow: '0 5px 0 var(--green-dark)' }}>
            <SharedList
              title="NETFLIX & MORE THAN CHILL"
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
              pageLimit={4}
            />
          </section>

          {/* BETS */}
          <section style={{ ...styles.section, borderColor: '#c45d2a', boxShadow: '0 5px 0 #c45d2a' }}>
            <SharedList
              title="CHARACTER IN DEVELOPMENT"
              icon="🎲"
              table="bets"
              doneField="won"
              placeholder="What's the bet...?"
              accentColor="#d97040"
              shadowColor="#c45d2a"
              emptyMsg="No bets yet. Someone's scared. 🐔"
              emptyEmoji="🐔"
              doneLabel="SETTLED"
              noMeta
              pageLimit={5}
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
  header: {
    textAlign: 'center',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: '#87CEEB',
    overflow: 'hidden',
  },
  headerBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
    opacity: 0.8,
    zIndex: 0,
  },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '12px 16px', position: 'relative', zIndex: 1 },
  title: { fontSize: 'clamp(16px, 4vw, 26px)', fontWeight: 900, color: 'var(--red)', textShadow: '3px 3px 0 var(--red-dark)', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#111', fontWeight: 700 },
  pixelDivider: { display: 'flex', height: 16, overflow: 'hidden' },
  pixelBlock: { flex: 1, minWidth: 0 },
  main: { display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 8, position: 'relative', zIndex: 1 },
  section: { background: 'var(--white)', borderRadius: 16, border: '3px solid', padding: 20 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  groundWrap: { position: 'relative', zIndex: 1, marginTop: 24 },
  ground: { background: 'var(--green)', padding: '8px 16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  footer: { background: 'var(--green-dark)', textAlign: 'center', padding: '10px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' },
 headerAvatar: {
  width: 100, height: 100,
  objectFit: 'contain',
  animation: 'bounce 1s ease-in-out infinite'
}
}