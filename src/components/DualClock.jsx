import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const TIMEZONES = [
  { label: 'Spain (Madrid)', value: 'Europe/Madrid' },
  { label: 'Finland (Helsinki)', value: 'Europe/Helsinki' },
  { label: 'UK (London)', value: 'Europe/London' },
  { label: 'Germany (Berlin)', value: 'Europe/Berlin' },
  { label: 'France (Paris)', value: 'Europe/Paris' },
  { label: 'Italy (Rome)', value: 'Europe/Rome' },
  { label: 'Netherlands', value: 'Europe/Amsterdam' },
  { label: 'Portugal (Lisbon)', value: 'Europe/Lisbon' },
  { label: 'UAE (Dubai)', value: 'Asia/Dubai' },
  { label: 'Japan (Tokyo)', value: 'Asia/Tokyo' },
  { label: 'Australia (Sydney)', value: 'Australia/Sydney' },
  { label: 'USA (New York)', value: 'America/New_York' },
  { label: 'USA (LA)', value: 'America/Los_Angeles' },
]

function getTime(tz) {
  return new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
}
function getDate(tz) {
  return new Date().toLocaleDateString('en-GB', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'short' })
}

function ClockCard({ name, city, tz, avatar, color, shadowColor }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ ...styles.clock, borderColor: shadowColor, boxShadow: `0 5px 0 ${shadowColor}` }}>
      <img src={avatar} alt={name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', border: '3px solid #eee', marginBottom: 4 }} />
      <div style={{ fontSize: 13, fontWeight: 800, color: shadowColor, marginBottom: 2 }}>{name}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>📍 {city}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
        {getTime(tz)}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2, fontWeight: 600 }}>{getDate(tz)}</div>
    </div>
  )
}

export default function DualClock() {
  const [samiTz, setSamiTz] = useState('Europe/Madrid')
  const [samiCity, setSamiCity] = useState('Spain')
  const [editing, setEditing] = useState(false)
  const [tempTz, setTempTz] = useState('Europe/Madrid')

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const tz = data.find(r => r.key === 'sami_timezone')
        const city = data.find(r => r.key === 'sami_city')
        if (tz) { setSamiTz(tz.value); setTempTz(tz.value) }
        if (city) setSamiCity(city.value)
      }
    })
    const ch = supabase.channel('settings-clock')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, p => {
        if (p.new?.key === 'sami_timezone') { setSamiTz(p.new.value); setTempTz(p.new.value) }
        if (p.new?.key === 'sami_city') setSamiCity(p.new.value)
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  const save = async () => {
    const label = TIMEZONES.find(t => t.value === tempTz)?.label || tempTz
    await supabase.from('settings').upsert([
      { key: 'sami_timezone', value: tempTz },
      { key: 'sami_city', value: label }
    ])
    setSamiTz(tempTz); setSamiCity(label); setEditing(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="section-label" style={{ color: 'var(--blue-dark)', marginBottom: 0 }}>
          🌍 WORLD CLOCK
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setEditing(true)}>
          ✏️ Update Sami's city
        </button>
      </div>

      <div style={styles.clocks}>
        <ClockCard name="Helena 🌺" city="Singapore / KL" tz="Asia/Singapore" avatar="/helena2.png" color="var(--red)" shadowColor="var(--red-dark)" />
        <div style={styles.vs}>
          <span style={{ fontSize: 28 }}>❤️</span>
          <div className="pixel-title" style={{ fontSize: 8, color: 'var(--text2)', marginTop: 4 }}>VS</div>
        </div>
        <ClockCard name="Sami ⚡" city={samiCity} tz={samiTz} avatar="/Sami2.png" color="var(--blue)" shadowColor="var(--blue-dark)" />
      </div>

      {editing && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
            <div className="pixel-title" style={{ fontSize: 10, color: 'var(--blue)', marginBottom: 6 }}>UPDATE SAMI'S LOCATION</div>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 14, fontWeight: 600 }}>Where's he wandered off to now? 🗺️</p>
            <select className="field" style={{ marginBottom: 16 }} value={tempTz} onChange={e => setTempTz(e.target.value)}>
              {TIMEZONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-blue" onClick={save}>✅ Save</button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  clocks: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
  clock: {
    background: 'var(--white)', borderRadius: 16, border: '3px solid',
    padding: '20px 24px', textAlign: 'center', minWidth: 170, flex: 1, maxWidth: 240
  },
  vs: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  modalBg: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
  },
  modal: {
    background: 'var(--white)', borderRadius: 16, border: '3px solid var(--blue-dark)',
    boxShadow: '0 6px 0 var(--blue-dark), 0 10px 30px rgba(0,0,0,0.2)',
    padding: '28px 24px', width: 340, textAlign: 'center'
  }
}
