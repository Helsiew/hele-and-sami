import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function SharedList({ title, table, doneField, placeholder, icon, typeOptions, accentColor, shadowColor, emptyMsg, emptyEmoji, doneLabel }) {
  const [items, setItems] = useState([])
  const [text, setText] = useState('')
  const [addedBy, setAddedBy] = useState('Helena')
  const [itemType, setItemType] = useState(typeOptions ? typeOptions[0] : null)

  useEffect(() => {
    supabase.from(table).select('*').order('created_at', { ascending: false })
      .then(({ data }) => data && setItems(data))
    const ch = supabase.channel(`${table}-ch`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        supabase.from(table).select('*').order('created_at', { ascending: false })
          .then(({ data }) => data && setItems(data))
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [table])

  const add = async () => {
    if (!text.trim()) return
const row = { [table === 'watchlist' ? 'title' : 'text']: text.trim(), added_by: addedBy, [doneField]: false }    if (typeOptions) row.type = itemType
    await supabase.from(table).insert([row])
    setText('')
  }

  const toggle = async (item) => {
    await supabase.from(table).update({ [doneField]: !item[doneField] }).eq('id', item.id)
  }

  const remove = async (id) => {
    await supabase.from(table).delete().eq('id', id)
  }

  const getForLabel = (item) => {
    if (table === 'todos') {
      return item.added_by === 'Helena' ? '👦 For Sami' : '👩 For Helena'
    }
    return item.added_by === 'Helena' ? '👩 Helena' : '👦 Sami'
  }

  const pending = items.filter(i => !i[doneField])
  const done = items.filter(i => i[doneField])

  return (
    <div>
      <div style={styles.header}>
        <div className="section-label" style={{ color: shadowColor, marginBottom: 0, fontSize: 9 }}>
          {icon} {title}
        </div>
        <span style={{ ...styles.badge, background: accentColor, color: 'white' }}>{pending.length}</span>
      </div>

      <div style={styles.form}>
        <div style={styles.byRow}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text2)' }}>Added by:</span>
          {['Helena', 'Sami'].map(n => (
            <button key={n} onClick={() => setAddedBy(n)}
              style={{ ...styles.byBtn, background: addedBy === n ? accentColor : 'white', color: addedBy === n ? 'white' : 'var(--text2)', borderColor: addedBy === n ? shadowColor : '#ddd', boxShadow: addedBy === n ? `0 3px 0 ${shadowColor}` : '0 2px 0 #ccc' }}>
              {n === 'Helena' ? '👩' : '👦'} {n}
            </button>
          ))}
        </div>
        {typeOptions && (
          <select className="field" value={itemType} onChange={e => setItemType(e.target.value)}>
            {typeOptions.map(t => <option key={t}>{t}</option>)}
          </select>
        )}
        <div style={styles.inputRow}>
          <input className="field" placeholder={placeholder} value={text}
            onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
          <button onClick={add} style={{ ...styles.addBtn, background: accentColor, borderColor: shadowColor, boxShadow: `0 3px 0 ${shadowColor}` }}>
            ADD
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div style={styles.empty}>
          <span style={{ fontSize: 28 }}>{emptyEmoji || '📭'}</span>
          <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>{emptyMsg || 'Nothing here yet!'}</p>
        </div>
      )}

      <div style={styles.list}>
        {pending.map(item => (
          <ListItem key={item.id} item={item} doneField={doneField} onToggle={toggle} onDelete={remove} accentColor={accentColor} shadowColor={shadowColor} forLabel={getForLabel(item)} />
        ))}
        {done.length > 0 && (
          <>
            <div style={{ ...styles.doneHeader, color: shadowColor }}>
              ── {doneLabel || 'DONE'} ({done.length}) ──
            </div>
            {done.map(item => (
              <ListItem key={item.id} item={item} doneField={doneField} onToggle={toggle} onDelete={remove} accentColor={accentColor} shadowColor={shadowColor} forLabel={getForLabel(item)} done />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function ListItem({ item, doneField, onToggle, onDelete, accentColor, shadowColor, forLabel, done }) {
  return (
    <div style={{ ...styles.item, opacity: done ? 0.55 : 1 }}>
      <button onClick={() => onToggle(item)}
        style={{ ...styles.check, borderColor: accentColor, background: item[doneField] ? accentColor : 'white', boxShadow: item[doneField] ? `0 2px 0 ${shadowColor}` : '0 2px 0 #ccc' }}>
        {item[doneField] && <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>✓</span>}
      </button>
      <div style={styles.itemContent}>
        <div style={{ fontSize: 15, fontWeight: 700, color: done ? '#aaa' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.4 }}>
          {item.title || item.text}
        </div>
        <div style={styles.tags}>
          <span style={{ ...styles.tag, background: `${accentColor}20`, color: shadowColor }}>{forLabel}</span>
          {item.type && <span style={{ ...styles.tag, background: '#e8f5e8', color: 'var(--green-dark)' }}>🎬 {item.type}</span>}
        </div>
      </div>
      <button style={styles.delBtn} onClick={() => onDelete(item.id)}>✕</button>
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  badge: { fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 999 },
  form: { background: '#f9f9f9', borderRadius: 12, border: '2px solid #eee', padding: 14, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 },
  byRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  byBtn: { fontSize: 13, fontWeight: 700, padding: '6px 12px', borderRadius: 8, border: '2px solid', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s' },
  inputRow: { display: 'flex', gap: 8 },
  addBtn: { padding: '10px 16px', border: '2px solid', borderRadius: 8, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: "'Nunito', sans-serif', whiteSpace: 'nowrap" },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  item: { display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 10, border: '2px solid #eee', padding: '10px 12px', transition: 'opacity 0.2s' },
  check: { width: 24, height: 24, borderRadius: 6, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' },
  itemContent: { flex: 1, minWidth: 0 },
  tags: { display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  tag: { fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 },
  delBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 14, flexShrink: 0 },
  doneHeader: { fontFamily: "'Press Start 2P', monospace", fontSize: 7, textAlign: 'center', margin: '8px 0 6px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }
}
