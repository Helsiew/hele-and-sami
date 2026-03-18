import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function daysLeft(dateStr) {
  const diff = new Date(dateStr) - new Date()
  if (diff <= 0) return 0
  return Math.ceil(diff / 86400000)
}

function totalDays(startStr, endStr) {
  const diff = new Date(endStr) - new Date(startStr)
  if (diff <= 0) return 1
  return Math.ceil(diff / 86400000)
}

function progressPercent(startStr, endStr) {
  const total = totalDays(startStr, endStr)
  const left = daysLeft(endStr)
  const elapsed = total - left
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

const HERO_KEY = 'hero_countdown'

export default function Countdowns() {
  const [hero, setHero] = useState(null)
  const [editingHero, setEditingHero] = useState(false)
  const [heroLabel, setHeroLabel] = useState('')
  const [heroEnd, setHeroEnd] = useState('')
  const [heroEmoji, setHeroEmoji] = useState('✈️')
  const [countdowns, setCountdowns] = useState([])
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')
  const [emoji, setEmoji] = useState('✈️')

  useEffect(() => {
    supabase.from('settings').select('*').eq('key', HERO_KEY).single()
      .then(({ data }) => {
        if (data?.value) {
          try { setHero(JSON.parse(data.value)) } catch (e) {}
        }
      })

    supabase.from('countdowns').select('*').order('date')
      .then(({ data }) => data && setCountdowns(data))

    const ch = supabase.channel('cd-ch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'countdowns' }, () => {
        supabase.from('countdowns').select('*').order('date')
          .then(({ data }) => data && setCountdowns(data))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => {
        if (payload.new?.key === HERO_KEY) {
          try { setHero(JSON.parse(payload.new.value)) } catch (e) {}
        }
      })
      .subscribe()

    return () => supabase.removeChannel(ch)
  }, [])

  const saveHero = async () => {
    if (!heroLabel.trim() || !heroEnd) return
    const value = JSON.stringify({
      label: heroLabel,
      end: new Date(heroEnd).toISOString(),
      start: new Date().toISOString(),
      emoji: heroEmoji
    })
    await supabase.from('settings').upsert([{ key: HERO_KEY, value }])
    setEditingHero(false)
  }

  const add = async () => {
    if (!label.trim() || !date) return
    await supabase.from('countdowns').insert([{ label, date: new Date(date).toISOString(), emoji }])
    setLabel(''); setDate(''); setEmoji('✈️'); setAdding(false)
  }

  const remove = async (id) => {
    await supabase.from('countdowns').delete().eq('id', id)
  }

  const openEditHero = () => {
    if (hero) {
      setHeroLabel(hero.label)
      setHeroEnd(hero.end ? new Date(hero.end).toISOString().slice(0, 10) : '')
      setHeroEmoji(hero.emoji || '✈️')
    }
    setEditingHero(true)
  }

  const progress = hero ? progressPercent(hero.start, hero.end) : 0
  const days = hero ? daysLeft(hero.end) : 0
  const done = hero && days === 0

  return (
    <div>
      {/* HERO COUNTDOWN */}
      <div style={styles.heroWrap}>
        <div style={styles.heroTop}>
          <div className="section-label" style={{ color: 'var(--red-dark)', marginBottom: 0, fontSize: 9 }}>
            ❤️ NEXT TIME TOGETHER
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={openEditHero}>
            ✏️ {hero ? 'Edit' : 'Set date'}
          </button>
        </div>

        {hero ? (
          <div style={styles.heroCard}>
            <div style={styles.heroEmoji}>{hero.emoji}</div>
            <div style={styles.heroLabel}>{hero.label}</div>

            {done ? (
              <div style={styles.heroDone}>🎉 TODAY IS THE DAY!!</div>
            ) : (
              <>
                <div style={styles.heroDays}>
                  <span style={styles.heroDaysNum}>{days}</span>
                  <span style={styles.heroDaysWord}>days to go</span>
                </div>

                <div style={styles.trackWrap}>
                  <div style={styles.track}>
                    <div style={{ ...styles.trackFill, width: `${progress}%` }} />
                    <div style={{ ...styles.avatar, left: `${progress / 2}%` }}>
                      <img src="/helena.png" alt="Helena" style={styles.avatarImg} />
                      <div style={styles.avatarName}>Helena</div>
                    </div>
                    <div style={{ ...styles.avatar, right: `${progress / 2}%` }}>
                      <img src="/sami.png" alt="Sami" style={styles.avatarImg} />
                      <div style={styles.avatarName}>Sami</div>
                    </div>
                  </div>
                </div>

                <div style={styles.progressLabels}>
                  <span style={styles.progressDate}>
                    {new Date(hero.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  <span style={styles.progressPct}>{Math.round(progress)}% of the wait is over</span>
                  <span style={styles.progressDate}>
                    {new Date(hero.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={styles.heroEmpty}>
            <span style={{ fontSize: 32 }}>✈️</span>
            <p style={{ fontSize: 15, color: 'var(--text2)', fontWeight: 600 }}>Set your next meetup date!</p>
            <button className="btn btn-red" onClick={openEditHero}>➕ Set date</button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingHero && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✈️</div>
            <div className="pixel-title" style={{ fontSize: 10, color: 'var(--red)', marginBottom: 16 }}>
              {hero ? 'EDIT COUNTDOWN' : 'SET YOUR NEXT MEETUP'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              <input className="field" placeholder="What's the occasion? 🎯" value={heroLabel} onChange={e => setHeroLabel(e.target.value)} />
              <input className="field" type="date" value={heroEnd} onChange={e => setHeroEnd(e.target.value)} />
              <div style={styles.emojiRow}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>Emoji:</span>
                {['✈️','💑','🎉','🏖️','🎄','🎂','🌟','🏠','🍄','⭐'].map(e => (
                  <button key={e} onClick={() => setHeroEmoji(e)}
                    style={{ ...styles.emojiBtn, background: heroEmoji === e ? 'var(--yellow-light)' : 'white', border: heroEmoji === e ? '2px solid var(--yellow-dark)' : '2px solid #ddd' }}>
                    {e}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-red" onClick={saveHero}>✅ Save</button>
                <button className="btn btn-ghost" onClick={() => setEditingHero(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTHER COUNTDOWNS */}
      <div style={{ marginTop: 20 }}>
        <div style={styles.subHeader}>
          <div className="section-label" style={{ color: 'var(--yellow-dark)', marginBottom: 0, fontSize: 9 }}>
            ⭐ OTHER COUNTDOWNS
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
            <span style={{ fontSize: 28 }}>🗓️</span>
            <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>No other countdowns yet!</p>
          </div>
        )}

        <div style={styles.grid}>
          {countdowns.map(cd => {
            const d = daysLeft(cd.date)
            return (
              <div key={cd.id} style={{ ...styles.card, borderColor: d === 0 ? 'var(--green-dark)' : 'var(--yellow-dark)', boxShadow: d === 0 ? '0 5px 0 var(--green-dark)' : '0 5px 0 var(--yellow-dark)' }}>
                <button style={styles.delBtn} onClick={() => remove(cd.id)}>✕</button>
                <div style={{ fontSize: 36, marginBottom: 4, animation: 'float 3s ease-in-out infinite' }}>{cd.emoji}</div>
                {d === 0 ? (
                  <div style={styles.todayBadge}>🎉 TODAY!!</div>
                ) : (
                  <>
                    <div style={styles.daysNum}>{d}</div>
                    <div style={styles.daysWord}>days to go</div>
                  </>
                )}
                <div style={styles.cdLabel}>{cd.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const styles = {
  heroWrap: { marginBottom: 8 },
  heroTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heroCard: {
    background: 'linear-gradient(135deg, #fff5f5, #fff9f0)',
    borderRadius: 20, border: '3px solid var(--red-dark)',
    boxShadow: '0 6px 0 var(--red-dark)',
    padding: '24px 20px', textAlign: 'center'
  },
  heroEmoji: { fontSize: 44, marginBottom: 4, animation: 'float 3s ease-in-out infinite' },
  heroLabel: { fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 12 },
  heroDays: { display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 20 },
  heroDaysNum: { fontFamily: "'Press Start 2P', monospace", fontSize: 44, color: 'var(--red)', lineHeight: 1 },
  heroDaysWord: { fontSize: 16, fontWeight: 700, color: 'var(--text2)' },
  heroDone: { fontSize: 24, fontWeight: 800, color: 'var(--green)', padding: '12px 0' },
  trackWrap: { padding: '40px 16px 16px', position: 'relative' },
  track: {
    height: 16, background: '#f0e6ff',
    borderRadius: 999, border: '2px solid #ddd',
    position: 'relative', overflow: 'visible'
  },
  trackFill: {
    height: '100%', background: 'linear-gradient(90deg, var(--red-light), var(--yellow))',
    borderRadius: 999, transition: 'width 1s ease'
  },
  avatar: {
    position: 'absolute', top: -44,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    transform: 'translateX(-50%)'
  },
  avatarImg: {
    width: 32, height: 32, borderRadius: '50%',
    objectFit: 'cover', border: '2px solid white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  },
  avatarName: { fontSize: 10, fontWeight: 700, color: 'var(--text2)', marginTop: 3, whiteSpace: 'nowrap' },
  progressLabels: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8 },
  progressDate: { fontSize: 12, fontWeight: 700, color: 'var(--text2)' },
  progressPct: { fontSize: 13, fontWeight: 700, color: 'var(--red)', textAlign: 'center' },
  heroEmpty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '24px 0' },
  modalBg: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: 'var(--white)', borderRadius: 16, border: '3px solid var(--red-dark)', boxShadow: '0 6px 0 var(--red-dark)', padding: '28px 24px', width: 360, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  emojiRow: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  emojiBtn: { fontSize: 20, borderRadius: 8, padding: '4px 6px', cursor: 'pointer' },
  subHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  form: { background: '#FFFBEA', borderRadius: 12, border: '2px solid var(--yellow)', padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 },
  card: { background: 'var(--white)', borderRadius: 16, border: '3px solid', padding: '18px 14px', textAlign: 'center', position: 'relative' },
  delBtn: { position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 14 },
  daysNum: { fontSize: 40, fontWeight: 800, color: 'var(--red)', lineHeight: 1, fontFamily: "'Press Start 2P', monospace" },
  daysWord: { fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginTop: 4, marginBottom: 6 },
  cdLabel: { fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 4 },
  todayBadge: { fontSize: 20, fontWeight: 800, color: 'var(--green)', marginBottom: 6 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }
}