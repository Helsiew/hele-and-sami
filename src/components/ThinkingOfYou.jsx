import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const SARCASTIC_SENT = [
  "Sent. He'll see it... eventually. 🙄",
  "Ping dispatched. Don't hold your breath. 💨",
  "Done. You're so needy. Adorably. 🥺",
  "Message sent into the void. 🌌",
  "He knows. Probably. Maybe. 🤷",
]

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

export default function ThinkingOfYou() {
  const [pings, setPings] = useState([])
  const [pinging, setPinging] = useState(false)
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

  const sendPing = async () => {
    if (pinging) return
    setPinging(true)
    setSentMsg(rand(SARCASTIC_SENT))
    setFlash(true)
    setStars(Array.from({ length: 8 }, (_, i) => ({ id: i, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 })))
    await supabase.from('pings').insert([{ from_name: who }])
    await fetchPings()
    setTimeout(() => { setPinging(false); setSentMsg(''); setFlash(false); setStars([]) }, 3000)
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="section-label" style={{ color: 'var(--red-dark)', marginBottom: 0, fontSize: 9 }}>
          ❤️ THINKING OF U
        </div>
      </div>

      <div style={{ ...styles.card, borderColor: flash ? 'var(--yellow-dark)' : 'var(--red-dark)', boxShadow: flash ? '0 5px 0 var(--yellow-dark)' : '0 5px 0 var(--red-dark)' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {stars.map(s => (
            <span key={s.id} style={{ position: 'absolute', fontSize: 20, transform: `translate(${s.x}px, ${s.y}px)`, animation: 'float 1s ease-out forwards', pointerEvents: 'none' }}>⭐</span>
          ))}

          <p style={styles.sub}>
            tap the button to send a little "thinking of u" 💌<br />
            <span style={{ fontSize: 13, color: '#aaa' }}>(it does nothing except make them smile)</span>
          </p>

          <div style={styles.whoRow}>
            {['Helena', 'Sami'].map(n => (
              <button key={n} onClick={() => setWho(n)}
                style={{ ...styles.whoBtn, background: who === n ? 'var(--red)' : 'white', color: who === n ? 'white' : 'var(--text2)', borderColor: who === n ? 'var(--red-dark)' : '#ddd', boxShadow: who === n ? '0 3px 0 var(--red-dark)' : '0 2px 0 #ccc' }}>
                {n === 'Helena' ? '👩' : '👦'} {n}
              </button>
            ))}
          </div>

          <button onClick={sendPing} disabled={pinging}
            style={{ ...styles.pingBtn, background: pinging ? '#eee' : 'var(--red)', color: pinging ? 'var(--text2)' : 'white', borderColor: pinging ? '#ccc' : 'var(--red-dark)', boxShadow: pinging ? 'none' : '0 5px 0 var(--red-dark)', transform: pinging ? 'translateY(3px)' : 'none' }}>
            {pinging ? '💌 Sent!' : '❤️ Send a ping'}
          </button>

          {sentMsg && (
            <p style={styles.sentMsg}>{sentMsg}</p>
          )}

          <div style={styles.lastPingArea}>
            {pings.length > 0 ? (
              <div style={styles.pingList}>
                <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text2)', marginBottom: 8 }}>LAST {pings.length} PINGS</p>
                {pings.map((ping, i) => (
                  <div key={ping.id || i} style={styles.pingRow}>
                    <span>{ping.from_name === 'Helena' ? '👩' : '👦'}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{ping.from_name}</span>
                    <span style={{ color: '#aaa', fontSize: 13 }}>— {timeAgo(ping.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ ...styles.lastPing, color: '#bbb' }}>No pings yet. Someone's playing it cool. 😎</p>
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
    padding: '24px 20px', textAlign: 'center', transition: 'border-color 0.3s, box-shadow 0.3s'
  },
  sub: { fontSize: 15, color: 'var(--text2)', fontWeight: 600, marginBottom: 16, lineHeight: 1.6 },
  whoRow: { display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 },
  whoBtn: { fontSize: 14, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: '2px solid', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s' },
  pingBtn: {
    fontSize: 16, fontWeight: 800, padding: '14px 36px',
    border: '3px solid', borderRadius: 12, cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s', marginBottom: 12
  },
  sentMsg: { fontSize: 15, fontWeight: 700, color: 'var(--green)', marginBottom: 8 },
  lastPingArea: { marginTop: 8, paddingTop: 12, borderTop: '2px solid #eee', width: '100%' },
  lastPing: { fontSize: 14, color: 'var(--text2)', fontWeight: 600 },
  pingList: { display: 'flex', flexDirection: 'column', gap: 6 },
  pingRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, justifyContent: 'center' }
}