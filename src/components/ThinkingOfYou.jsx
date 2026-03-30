import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const MOODS = [
  { type: 'thinking of u',       emoji: '❤️',  label: 'thinking of u' },
  { type: 'u pissing me off bij', emoji: '😤',  label: 'u pissing me off bij' },
  { type: 'i miss u',            emoji: '🥺',  label: 'i miss u' },
  { type: 'big hug pls',         emoji: '🤗',  label: 'big hug pls' },
  { type: 'kisses',              emoji: '💋',  label: '💋💋💋💋' },
  { type: 'im sorry',            emoji: '☹️',  label: 'im sorry' },
]

const MOOD_REPLIES = {
  'thinking of u':        ["Sent. Sappily and without shame. 🥹", "They're blushing. Probably. 🌸", "Cute. Disgustingly cute. 💕"],
  'u pissing me off bij': ["Uh oh. Drama served. 👀", "They should be nervous. Good. 😤", "Sent. Best of luck to them. 😈"],
  'i miss u':             ["Ache dispatched. Handle with care. 💔", "So needy. So adorably needy. 😭", "Miss them more, coward. 🌊"],
  'big hug pls':          ["Virtual hug en route. ETA: unknown. 🤗", "Hug request dispatched. 🫂", "Aww. They better deliver."],
  'kisses':               ["Softest thing ever. Sent. 🥺", "They'll screenshot this forever. 📸", "Ugh. You two are a lot. 💋"],
  'im sorry':             ["Apology logged. Now grovel harder. 😇", "Sent with humility. Good. 🙏", "They'll forgive you. Eventually. 😌"],
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now 🥰'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  return `${days}d ago`
}

function parsePing(ping) {
  const parts = ping.from_name.split('|')
  return { name: parts[0], mood: parts[1] || null }
}

export default function ThinkingOfYou() {
  const [pings, setPings] = useState([])
  const [pinging, setPinging] = useState(null)
  const [sentMsg, setSentMsg] = useState('')
  const [who, setWho] = useState('Helena')
  const [flash, setFlash] = useState(false)
  const [stars, setStars] = useState([])

  const fetchPings = async () => {
    const { data } = await supabase
      .from('pings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
    if (data) setPings(data)
  }

  useEffect(() => {
    fetchPings()
    const ch = supabase.channel('pings-ch')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pings' }, () => {
        fetchPings()
        setFlash(true)
        setStars(Array.from({ length: 8 }, (_, i) => ({ id: i, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 })))
        setTimeout(() => { setFlash(false); setStars([]) }, 2000)
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  const sendPing = async (type) => {
    if (pinging) return
    setPinging(type)
    setSentMsg(rand(MOOD_REPLIES[type] || ['Sent! 💌']))
    setFlash(true)
    setStars(Array.from({ length: 8 }, (_, i) => ({ id: i, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 })))
    await supabase.from('pings').insert([{ from_name: `${who}|${type}` }])
    await fetchPings()
    setTimeout(() => { setPinging(null); setSentMsg(''); setFlash(false); setStars([]) }, 3000)
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="section-label" style={{ color: '#3b0764', marginBottom: 0, fontSize: 11 }}>
          💌 SEND A VIBE
        </div>
      </div>

      <div style={{ ...styles.card, borderColor: flash ? 'var(--yellow-dark)' : '#5b21b6', boxShadow: flash ? '0 5px 0 var(--yellow-dark)' : '0 5px 0 #3b0764' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {stars.map(s => (
            <span key={s.id} style={{ position: 'absolute', fontSize: 20, transform: `translate(${s.x}px, ${s.y}px)`, animation: 'float 1s ease-out forwards', pointerEvents: 'none' }}>⭐</span>
          ))}

          <p style={styles.sub}>
            tap a button to send a little feeling 💌<br />
            <span style={{ fontSize: 12, color: '#aaa' }}>(it does nothing except make them smile)</span>
          </p>

          <div style={styles.whoRow}>
            {['Helena', 'Sami'].map(n => (
              <button key={n} onClick={() => setWho(n)}
                style={{ ...styles.whoBtn, background: who === n ? '#5b21b6' : 'white', color: who === n ? 'white' : 'var(--text2)', borderColor: who === n ? '#3b0764' : '#ddd', boxShadow: who === n ? '0 3px 0 #3b0764' : '0 2px 0 #ccc' }}>
                {n === 'Helena' ? '👩' : '👦'} {n}
              </button>
            ))}
          </div>

          <div style={styles.moodGrid}>
            {MOODS.map(m => {
              const isSending = pinging === m.type
              return (
                <button key={m.type} onClick={() => sendPing(m.type)} disabled={!!pinging}
                  style={{ ...styles.moodBtn, opacity: pinging && !isSending ? 0.5 : 1, background: isSending ? 'var(--yellow-light)' : 'white', borderColor: isSending ? 'var(--yellow-dark)' : '#ddd', boxShadow: isSending ? '0 3px 0 var(--yellow-dark)' : '0 3px 0 #ccc', transform: isSending ? 'translateY(2px)' : 'none' }}>
                  <span style={{ fontSize: 18 }}>{m.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isSending ? 'var(--yellow-dark)' : 'var(--text2)', lineHeight: 1.2 }}>
                    {isSending ? 'sent! 💌' : m.label}
                  </span>
                </button>
              )
            })}
          </div>

          {sentMsg && <p style={styles.sentMsg}>{sentMsg}</p>}

          <div style={styles.lastPingArea}>
            {pings.length > 0 ? (
              <div>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, fontWeight: 800, color: 'var(--text2)', marginBottom: 10 }}>
                  LAST {pings.length} VIBES
                </p>
                <div style={styles.pingList}>
                  {pings.map((ping, i) => {
                    const { name, mood } = parsePing(ping)
                    const moodData = MOODS.find(m => m.type === mood)
                    return (
                      <div key={ping.id || i} style={styles.pingRow}>
                        <span style={{ fontSize: 18 }}>{name === 'Helena' ? '👩' : '👦'}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                          <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: 12 }}>{name}</span>
                          {mood
                            ? <span style={{ fontSize: 11, color: '#5b21b6' }}>{moodData?.emoji} {moodData?.label || mood}</span>
                            : <span style={{ fontSize: 11, color: 'var(--text2)' }}>❤️ ping</span>
                          }
                          <span style={{ color: '#bbb', fontSize: 10 }}>{timeAgo(ping.created_at)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p style={{ color: '#bbb', fontSize: 13, fontWeight: 600 }}>No vibes yet. Someone's playing it cool. 😎</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  card: {
    background: 'var(--white)', borderRadius: 16, border: '3px solid',
    padding: '14px 12px', textAlign: 'center', transition: 'border-color 0.3s, box-shadow 0.3s'
  },
  sub: { fontSize: 13, color: 'var(--text2)', fontWeight: 600, marginBottom: 8, lineHeight: 1.4 },
  whoRow: { display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 14 },
  whoBtn: { fontSize: 14, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '2px solid', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s' },
  moodGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, width: '100%', marginBottom: 10 },
  moodBtn: {
    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-start',
    padding: '7px 10px', border: '2px solid', borderRadius: 10,
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s'
  },
  sentMsg: { fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 8 },
  lastPingArea: { marginTop: 10, paddingTop: 12, borderTop: '2px solid #eee', width: '100%', textAlign: 'left' },
  pingList: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  pingRow: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }
}
