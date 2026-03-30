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
      {/* Scattered clouds throughout page */}
      <div style={styles.cloudsBg} aria-hidden>
        {[
          { top: '2%',  left: '5%',  scale: 1.1 },
          { top: '4%',  left: '60%', scale: 0.8 },
          { top: '1%',  left: '32%', scale: 0.6 },
          { top: '8%',  left: '80%', scale: 0.9 },
          { top: '13%', left: '15%', scale: 0.7 },
          { top: '18%', left: '70%', scale: 1.0 },
          { top: '24%', left: '40%', scale: 0.65 },
          { top: '30%', left: '2%',  scale: 0.8 },
          { top: '36%', left: '55%', scale: 1.1 },
          { top: '42%', left: '20%', scale: 0.75 },
          { top: '50%', left: '75%', scale: 0.6 },
          { top: '57%', left: '8%',  scale: 0.9 },
          { top: '63%', left: '48%', scale: 0.7 },
          { top: '70%', left: '85%', scale: 1.0 },
          { top: '77%', left: '25%', scale: 0.65 },
          { top: '84%', left: '62%', scale: 0.8 },
          { top: '91%', left: '10%', scale: 0.7 },
          { top: '95%', left: '45%', scale: 0.9 },
        ].map((c, i) => (
          <svg key={i} style={{ position: 'absolute', top: c.top, left: c.left, transform: `scale(${c.scale})`, opacity: 0.55, pointerEvents: 'none' }} width="100" height="50" viewBox="0 0 100 50">
            <ellipse cx="50" cy="36" rx="44" ry="14" fill="white" />
            <ellipse cx="35" cy="26" rx="22" ry="17" fill="white" />
            <ellipse cx="65" cy="24" rx="20" ry="16" fill="white" />
          </svg>
        ))}
      </div>

      <header style={styles.header}>
        {/* Mario art background */}
        <div style={styles.marioArt} aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 800 130" preserveAspectRatio="xMidYMid slice">
            {/* Left green pipe */}
            <rect x="18" y="52" width="52" height="78" fill="#3ea535" rx="3"/>
            <rect x="10" y="44" width="68" height="20" fill="#4ec744" rx="4"/>
            <rect x="24" y="52" width="8" height="78" fill="#2d8028" rx="2"/>

            {/* Right green pipe (shorter) */}
            <rect x="726" y="68" width="44" height="62" fill="#3ea535" rx="3"/>
            <rect x="718" y="60" width="60" height="18" fill="#4ec744" rx="4"/>
            <rect x="732" y="68" width="7" height="62" fill="#2d8028" rx="2"/>

            {/* Question mark block */}
            <rect x="148" y="14" width="38" height="38" fill="#e8b800" rx="4"/>
            <rect x="150" y="16" width="34" height="4" fill="#f5d000"/>
            <rect x="150" y="16" width="4" height="34" fill="#f5d000"/>
            <text x="167" y="41" textAnchor="middle" fill="#7a4500" fontSize="22" fontWeight="900" fontFamily="monospace">?</text>
            <rect x="148" y="48" width="38" height="4" fill="#b08800" rx="2"/>

            {/* Brick block x2 */}
            <rect x="200" y="14" width="38" height="38" fill="#c0733a" rx="3"/>
            <line x1="200" y1="33" x2="238" y2="33" stroke="#8b4513" strokeWidth="3"/>
            <line x1="219" y1="14" x2="219" y2="52" stroke="#8b4513" strokeWidth="3"/>
            <rect x="200" y="48" width="38" height="4" fill="#8b4513" rx="2"/>

            <rect x="242" y="14" width="38" height="38" fill="#c0733a" rx="3"/>
            <line x1="242" y1="33" x2="280" y2="33" stroke="#8b4513" strokeWidth="3"/>
            <line x1="261" y1="14" x2="261" y2="52" stroke="#8b4513" strokeWidth="3"/>
            <rect x="242" y="48" width="38" height="4" fill="#8b4513" rx="2"/>

            {/* Coins right side */}
            <ellipse cx="530" cy="32" rx="11" ry="13" fill="#f6c90e" stroke="#c8a200" strokeWidth="2"/>
            <ellipse cx="530" cy="32" rx="6" ry="8" fill="#c8a200"/>

            <ellipse cx="570" cy="20" rx="10" ry="12" fill="#f6c90e" stroke="#c8a200" strokeWidth="2"/>
            <ellipse cx="570" cy="20" rx="5" ry="7" fill="#c8a200"/>

            <ellipse cx="610" cy="36" rx="9" ry="11" fill="#f6c90e" stroke="#c8a200" strokeWidth="2"/>
            <ellipse cx="610" cy="36" rx="5" ry="6" fill="#c8a200"/>

            {/* Sparkle stars */}
            <text x="108" y="30" fontSize="14" fill="white" opacity="0.9" fontFamily="monospace">✦</text>
            <text x="680" y="28" fontSize="12" fill="white" opacity="0.9" fontFamily="monospace">✦</text>
            <text x="650" y="55" fontSize="9" fill="white" opacity="0.7" fontFamily="monospace">✦</text>
            <text x="340" y="18" fontSize="10" fill="white" opacity="0.7" fontFamily="monospace">✦</text>
            <text x="460" y="14" fontSize="8" fill="white" opacity="0.6" fontFamily="monospace">✦</text>
          </svg>
        </div>

        <div style={{ ...styles.titleRow, position: 'relative', zIndex: 1 }}>
          <img src="/helena.png" alt="Helena" style={{ ...styles.headerAvatar, animationDelay: '0s' }} />
<div>
  <h1 className="pixel-title" style={styles.title}>HELENA & SAMI</h1>
  <p style={styles.subtitle}>⭐ our little corner of the internet ⭐</p>
</div>
<img src="/sami.png" alt="Sami" style={{ ...styles.headerAvatar, animationDelay: '0.3s' }} />
        </div>

        {/* Pixel divider — gold/yellow */}
        <div style={{ ...styles.pixelDivider, position: 'relative', zIndex: 1 }}>
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
  cloudsBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 },
  header: { textAlign: 'center', padding: '0', position: 'sticky', top: 0, zIndex: 50, background: '#87CEEB', overflow: 'hidden' },
  marioArt: { position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12, paddingTop: 16 },
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