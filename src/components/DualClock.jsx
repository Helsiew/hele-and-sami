import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

// Lat/lng for every timezone option — pins auto-move when location updates.
// Australian cities use effective (mapped) lats because the artistic Mario map
// places the southern hemisphere much higher than a real equirectangular formula
// would — real coords push AU pins completely off the bottom edge of the image.
const CITY_COORDS = {
  // Asia
  'Asia/Singapore':      { lat: 1.35,   lng: 103.82 },
  'Asia/Dubai':          { lat: 25.20,  lng: 55.27  },
  'Asia/Tokyo':          { lat: 35.68,  lng: 139.69 },
  'Asia/Seoul':          { lat: 37.57,  lng: 126.98 },
  'Asia/Bangkok':        { lat: 13.76,  lng: 100.50 },
  'Asia/Ho_Chi_Minh':   { lat: 10.82,  lng: 106.63 },
  'Asia/Taipei':         { lat: 25.03,  lng: 121.57 },
  'Asia/Hong_Kong':      { lat: 22.32,  lng: 114.17 },
  'Asia/Shanghai':       { lat: 39.90,  lng: 116.40 }, // Beijing — central China
  // Europe
  'Europe/Madrid':       { lat: 40.42,  lng: -3.70  },
  'Europe/Helsinki':     { lat: 60.17,  lng: 24.94  },
  'Europe/London':       { lat: 51.51,  lng: -0.13  },
  'Europe/Berlin':       { lat: 52.52,  lng: 13.40  },
  'Europe/Paris':        { lat: 48.85,  lng: 2.35   },
  'Europe/Rome':         { lat: 41.90,  lng: 12.50  },
  'Europe/Amsterdam':    { lat: 52.37,  lng: 4.90   },
  'Europe/Lisbon':       { lat: 38.72,  lng: -9.14  },
  'Europe/Athens':       { lat: 37.98,  lng: 23.73  },
  'Europe/Zagreb':       { lat: 45.81,  lng: 15.98  },
  'Atlantic/Canary':     { lat: 28.29,  lng: -16.63 },
  // Americas
  'America/New_York':    { lat: 40.71,  lng: -74.01 },
  'America/Los_Angeles': { lat: 34.05,  lng: -118.24 },
  'America/Nassau':      { lat: 25.05,  lng: -77.34 },
  'America/Barbados':    { lat: 13.10,  lng: -59.62 },
  // Australia — effective lats back-calculated so pins land in the right visual
  // spot on this specific artistic map (real lats push pins off the bottom edge)
  'Australia/Brisbane':  { lat: 2.50,   lng: 153.02 }, // effective → ~64% down
  'Australia/Sydney':    { lat: -4.10,  lng: 151.21 }, // effective → ~70% down
  'Australia/Melbourne': { lat: -8.50,  lng: 144.96 }, // effective → ~74% down
}

// Equirectangular projection with y-calibration for this specific worldmap.png.
// The map's tropical/southern regions sit lower than a pure formula predicts,
// so we apply a progressive downward shift below y=25%.
// Calibrated so Singapore (formula 49.3%) → lands at ~65% on the image.
function coordToPercent(lat, lng) {
  const x = (lng + 180) / 360 * 100
  const yRaw = (90 - lat) / 180 * 100
  const y = Math.min(97, yRaw + Math.max(0, yRaw - 25) * 0.65)
  return { x, y }
}

function MapPin({ tz, avatar, color }) {
  const coords = CITY_COORDS[tz]
  if (!coords) return null
  const { x, y } = coordToPercent(coords.lat, coords.lng)
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pointerEvents: 'none',
      zIndex: 2,
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
    }}>
      <img src={avatar} alt="" style={{
        width: 42, height: 42,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        objectFit: 'cover',
        background: 'white',
        display: 'block',
      }} />
      <div style={{
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: `10px solid ${color}`,
        marginTop: -1,
      }} />
    </div>
  )
}

function WorldMap({ helenaTz, samiTz }) {
  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
      <img src="/worldmap.png" alt="World Map" style={{ width: '100%', display: 'block' }} />
      <MapPin tz={helenaTz} avatar="/helena2.png" color="var(--red-dark)" />
      <MapPin tz={samiTz} avatar="/Sami2.png" color="var(--blue-dark)" />
    </div>
  )
}

const TIMEZONES = [
  // Asia
  { label: 'Singapore / KL', value: 'Asia/Singapore' },
  { label: 'UAE (Dubai)', value: 'Asia/Dubai' },
  { label: 'Japan (Tokyo)', value: 'Asia/Tokyo' },
  { label: 'Korea (Seoul)', value: 'Asia/Seoul' },
  { label: 'Thailand (Bangkok / Phuket)', value: 'Asia/Bangkok' },
  { label: 'Vietnam (Ho Chi Minh)', value: 'Asia/Ho_Chi_Minh' },
  { label: 'Taiwan (Taipei)', value: 'Asia/Taipei' },
  { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
  { label: 'China', value: 'Asia/Shanghai' },
  // Europe
  { label: 'Spain (Madrid)', value: 'Europe/Madrid' },
  { label: 'Finland (Helsinki)', value: 'Europe/Helsinki' },
  { label: 'UK (London)', value: 'Europe/London' },
  { label: 'Germany (Berlin)', value: 'Europe/Berlin' },
  { label: 'France (Paris)', value: 'Europe/Paris' },
  { label: 'Italy (Rome)', value: 'Europe/Rome' },
  { label: 'Netherlands', value: 'Europe/Amsterdam' },
  { label: 'Portugal (Lisbon)', value: 'Europe/Lisbon' },
  { label: 'Greece (Athens)', value: 'Europe/Athens' },
  { label: 'Croatia (Zagreb)', value: 'Europe/Zagreb' },
  { label: 'Canary Islands', value: 'Atlantic/Canary' },
  // Americas
  { label: 'USA (New York)', value: 'America/New_York' },
  { label: 'USA (LA)', value: 'America/Los_Angeles' },
  { label: 'Bahamas (Nassau)', value: 'America/Nassau' },
  { label: 'Caribbean (Barbados)', value: 'America/Barbados' },
  // Australia
  { label: 'Australia (Brisbane)', value: 'Australia/Brisbane' },
  { label: 'Australia (Sydney)', value: 'Australia/Sydney' },
  { label: 'Australia (Melbourne)', value: 'Australia/Melbourne' },
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
      <img src={avatar} alt={name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%', border: `3px solid ${shadowColor}`, flexShrink: 0 }} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: shadowColor }}>{name}</span>
          <span style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600 }}>📍 {city}</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', letterSpacing: 1, lineHeight: 1 }}>
          {getTime(tz)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, fontWeight: 600 }}>{getDate(tz)}</div>
      </div>
    </div>
  )
}

export default function DualClock() {
  const [samiTz, setSamiTz] = useState('Europe/Madrid')
  const [samiCity, setSamiCity] = useState('Spain')
  const [helenaTz, setHelenaTz] = useState('Asia/Singapore')
  const [helenaCity, setHelenaCity] = useState('Singapore / KL')
  const [editing, setEditing] = useState(false)
  const [who, setWho] = useState('helena')
  const [tempTz, setTempTz] = useState('Asia/Singapore')

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const samiTzRow = data.find(r => r.key === 'sami_timezone')
        const samiCityRow = data.find(r => r.key === 'sami_city')
        const helenaTzRow = data.find(r => r.key === 'helena_timezone')
        const helenaCityRow = data.find(r => r.key === 'helena_city')
        if (samiTzRow) setSamiTz(samiTzRow.value)
        if (samiCityRow) setSamiCity(samiCityRow.value)
        if (helenaTzRow) { setHelenaTz(helenaTzRow.value); }
        if (helenaCityRow) setHelenaCity(helenaCityRow.value)
      }
    })
    const ch = supabase.channel('settings-clock')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, p => {
        if (p.new?.key === 'sami_timezone') setSamiTz(p.new.value)
        if (p.new?.key === 'sami_city') setSamiCity(p.new.value)
        if (p.new?.key === 'helena_timezone') setHelenaTz(p.new.value)
        if (p.new?.key === 'helena_city') setHelenaCity(p.new.value)
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  const openEdit = (person) => {
    setWho(person)
    setTempTz(person === 'helena' ? helenaTz : samiTz)
    setEditing(true)
  }

  const save = async () => {
    const label = TIMEZONES.find(t => t.value === tempTz)?.label || tempTz
    if (who === 'helena') {
      await supabase.from('settings').upsert([
        { key: 'helena_timezone', value: tempTz },
        { key: 'helena_city', value: label }
      ])
      setHelenaTz(tempTz); setHelenaCity(label)
    } else {
      await supabase.from('settings').upsert([
        { key: 'sami_timezone', value: tempTz },
        { key: 'sami_city', value: label }
      ])
      setSamiTz(tempTz); setSamiCity(label)
    }
    setEditing(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="section-label" style={{ color: 'var(--blue-dark)', marginBottom: 0, fontSize: 11 }}>
          🌍 US AROUND THE WORLD
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-blue" style={{ fontSize: 10, padding: '4px 8px' }} onClick={() => openEdit('helena')}>
            Edit Hele's
          </button>
          <button className="btn btn-blue" style={{ fontSize: 10, padding: '4px 8px' }} onClick={() => openEdit('sami')}>
            Edit Sami's
          </button>
        </div>
      </div>

      <WorldMap helenaTz={helenaTz} samiTz={samiTz} />

      <div style={styles.clocks}>
        <ClockCard name="Helena 🌺" city={helenaCity} tz={helenaTz} avatar="/helena2.png" color="var(--red)" shadowColor="var(--red-dark)" />
        <ClockCard name="Sami ⚡" city={samiCity} tz={samiTz} avatar="/Sami2.png" color="var(--blue)" shadowColor="var(--blue-dark)" />
      </div>

      {editing && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📍</div>
            <div className="pixel-title" style={{ fontSize: 10, color: 'var(--blue)', marginBottom: 6 }}>
              {who === 'helena' ? "UPDATE HELENA'S LOCATION" : "UPDATE SAMI'S LOCATION"}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 14, fontWeight: 600 }}>
              {who === 'helena' ? 'Where are you? 🌺' : "Where's he wandered off to? 🗺️"}
            </p>
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
  clocks: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  clock: {
    background: 'var(--white)', borderRadius: 16, border: '3px solid',
    padding: '8px 12px', display: 'flex', flexDirection: 'row',
    alignItems: 'center', gap: 10, flex: 1, minWidth: 180,
  },
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
