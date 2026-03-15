import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function daysLeft(dateStr) {
  const diff = new Date(dateStr) - new Date()
  if (diff <= 0) return 0
  return Math.ceil(diff / 86400000)
}

export default function Countdowns() {
  const [countdowns, setCountdowns] = useState([])
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')
  const [emoji, setEmoji] = useState('✈️')

  useEffect(() => {
    supabase.from('countdowns').select('*').order('date')
      .then(({ data }) => data && setCountdowns(data))
    const ch = supabase.channel('cd-ch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'countdowns' }, () => {
        supabase.from('countdowns').select('*').order('date')
          .then(({ data }) => data && setCountdowns(data))
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  const add = async () => {
    if (!label.trim() || !date) return
    await supabase.from('countdowns').insert([{ label, date: new Date(date).toISOString(), emoji }])
    setLabel(''); setDate(''); setEmoji('✈️'); setAdding(false)
  }

  const remove = async (id) => {
    await supabase.from('countdowns').delete().eq('id', id)
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="section-label" style={{ color: 'var(--yellow-dark)', marginBottom: 0 }}>
          ⭐ COUNTDOWNS
          <style>{`.section-label::after { background: var(--yellow); }`}</style>
        </div>
        <button className="btn btn-yellow" style={{ fontSize: 13 }} onClick={() => setAdding(a => !a)}>
          {adding ? '✕ Cancel' : '➕ Add'}
        </button>
      </div>

      {adding && (
        <div style={styles.form}>
          <input className="field" placeholder="What are we counting down to? 🎯" value={label} onChange={e => setLabel(e.target.value)} />
          <input className="field" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <div style={styles.emojiRow}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>Pick an emoji:</span>
            {['✈️','💑','🎉','🏖️','🎄','🎂','🌟','🏠','🍄','⭐'].map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                style={{ ...styles.emojiBtn, background: emoji === e ? 'var(--yellow-light)' : 'white', border: emoji === e ? '2px solid var(--yellow-dark)' : '2px solid #ddd' }}>
                {e}
              </button>
            ))}
          </div>
          <button className="btn btn-green" onClick={add}>✅ Save Countdown</button>
        </div>
      )}

      {countdowns.length === 0 && !adding && (
        <div style={styles.empty}>
          <span style={{ fontSize: 32 }}>🗓️</span>
          <p style={{ fontSize: 15, color: 'var(--text2)', fontWeight: 600 }}>No countdowns yet — add your next visit!</p>
        </div>
      )}

      <div style={styles.grid}>
        {countdowns.map(cd => {
          const days = daysLeft(cd.date)
          const done = days === 0
          return (
            <div key={cd.id} style={{ ...styles.card, borderColor: done ? 'var(--green-dark)' : 'var(--yellow-dark)', boxShadow: done ? '0 5px 0 var(--green-dark)' : '0 5px 0 var(--yellow-dark)' }}>
              <button style={styles.delBtn} onClick={() => remove(cd.id)}>✕</button>
              <div style={{ fontSize: 44, marginBottom: 6, animation: 'float 3s ease-in-out infinite' }}>{cd.emoji}</div>
              {done ? (
                <div style={styles.todayBadge}>🎉 TODAY!!</div>
              ) : (
                <>
                  <div style={styles.daysNum}>{days}</div>
                  <div style={styles.daysWord}>days to go</div>
                </>
              )}
              <div style={styles.cdLabel}>{cd.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  form: {
    background: '#FFFBEA', borderRadius: 12, border: '2px solid var(--yellow)',
    padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10
  },
  emojiRow: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  emojiBtn: { fontSize: 20, borderRadius: 8, padding: '4px 6px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 },
  card: {
    background: 'var(--white)', borderRadius: 16, border: '3px solid',
    padding: '20px 16px', textAlign: 'center', position: 'relative'
  },
  delBtn: { position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 14 },
  daysNum: { fontSize: 52, fontWeight: 800, color: 'var(--red)', lineHeight: 1, fontFamily: "'Press Start 2P', monospace" },
  daysWord: { fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginTop: 4, marginBottom: 8 },
  cdLabel: { fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 6 },
  todayBadge: { fontSize: 22, fontWeight: 800, color: 'var(--green)', marginBottom: 8 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 0' }
}
