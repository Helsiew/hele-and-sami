import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'today'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

export default function SharedList({ title, table, doneField, placeholder, icon, typeOptions, accentColor, shadowColor, emptyMsg, emptyEmoji, doneLabel, noMeta, pageLimit }) {
  const [items, setItems] = useState([])
  const [text, setText] = useState('')
  const [addedBy, setAddedBy] = useState('Helena')
  const [itemType, setItemType] = useState(typeOptions ? typeOptions[0] : null)
  const [page, setPage] = useState(1)
  const listRef = useRef(null)
  const [listHeight, setListHeight] = useState(null)

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

  // Lock list height after first render with items
  useEffect(() => {
    if (listRef.current && items.length > 0 && !listHeight) {
      const h = listRef.current.offsetHeight
      if (h > 0) setListHeight(h)
    }
  }, [items.length, listHeight])

  const add = async () => {
    if (!text.trim()) return
    const row = { [table === 'watchlist' ? 'title' : 'text']: text.trim(), added_by: addedBy, [doneField]: false }
    if (typeOptions) row.type = itemType
    await supabase.from(table).insert([row])
    setText('')
    setPage(1)
    setListHeight(null) // reset lock so new height is measured
  }

  const toggle = async (item) => {
    await supabase.from(table).update({ [doneField]: !item[doneField] }).eq('id', item.id)
  }

  const remove = async (id) => {
    await supabase.from(table).delete().eq('id', id)
    setListHeight(null)
  }

  const getForLabel = (item) => {
    if (table === 'todos') {
      if (item.added_by === 'Sami') return '👦 For Sami'
      if (item.added_by === 'Us') return '👫 For Us'
      return '👩 For Helena'
    }
    return item.added_by === 'Helena' ? '👩 Helena' : '👦 Sami'
  }

  const isTodos = table === 'todos'
  const pending = items.filter(i => !i[doneField])
  const done = items.filter(i => i[doneField])

  const limit = pageLimit || pending.length
  const totalPages = Math.max(1, Math.ceil(pending.length / limit))
  const safePage = Math.min(page, totalPages)
  const visiblePending = pending.slice((safePage - 1) * limit, safePage * limit)

  return (
    <div>
      <div style={styles.header}>
        <div className="section-label" style={{ color: shadowColor, marginBottom: 0, fontSize: 11 }}>
          {icon} {title}
        </div>
        <span style={{ ...styles.badge, background: accentColor, color: 'white' }}>{pending.length}</span>
      </div>

      <div style={styles.form}>
        <div style={styles.byRow}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>
            {isTodos ? 'This is for:' : 'Added by:'}
          </span>
          {(isTodos ? ['Helena', 'Sami', 'Us'] : ['Helena', 'Sami']).map(n => (
            <button key={n} onClick={() => setAddedBy(n)}
              style={{ ...styles.byBtn, background: addedBy === n ? accentColor : 'white', color: addedBy === n ? 'white' : 'var(--text2)', borderColor: addedBy === n ? shadowColor : '#ddd', boxShadow: addedBy === n ? `0 3px 0 ${shadowColor}` : '0 2px 0 #ccc' }}>
              {n === 'Helena' ? '👩' : n === 'Sami' ? '👦' : '👫'} {n}
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

      {/* Locked-height list only */}
      <div ref={listRef} style={{ minHeight: listHeight || undefined }}>
        <div style={styles.list}>
          {visiblePending.map(item => (
            <ListItem key={item.id} item={item} doneField={doneField} onToggle={toggle} onDelete={remove} accentColor={accentColor} shadowColor={shadowColor} forLabel={getForLabel(item)} noMeta={noMeta} />
          ))}
        </div>
      </div>

      {pageLimit && totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            style={{ ...styles.pageBtn, opacity: safePage === 1 ? 0.35 : 1, borderColor: accentColor, color: accentColor }}>
            ‹
          </button>
          <span style={{ ...styles.pageLabel, color: shadowColor }}>
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            style={{ ...styles.pageBtn, opacity: safePage === totalPages ? 0.35 : 1, borderColor: accentColor, color: accentColor }}>
            ›
          </button>
        </div>
      )}

      {done.length > 0 && (
        <>
          <div style={{ ...styles.doneHeader, color: shadowColor }}>── {doneLabel || 'DONE'} ({done.length}) ──</div>
          <div style={styles.list}>
            {done.map(item => (
              <ListItem key={item.id} item={item} doneField={doneField} onToggle={toggle} onDelete={remove} accentColor={accentColor} shadowColor={shadowColor} forLabel={getForLabel(item)} noMeta={noMeta} done />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ListItem({ item, doneField, onToggle, onDelete, accentColor, shadowColor, forLabel, done, noMeta }) {
  return (
    <div style={{ ...styles.item, opacity: done ? 0.55 : 1 }}>
      <button onClick={() => onToggle(item)}
        style={{ ...styles.check, borderColor: accentColor, background: item[doneField] ? accentColor : 'white', boxShadow: item[doneField] ? `0 2px 0 ${shadowColor}` : '0 2px 0 #ccc' }}>
        {item[doneField] && <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>✓</span>}
      </button>
      <div style={styles.itemContent}>
        <div style={{ fontSize: 13, fontWeight: 700, color: done ? '#aaa' : 'var(--text)', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3 }}>
          {item.title || item.text}
        </div>
        <div style={styles.tags}>
          {!noMeta && (
            <span style={{ ...styles.tag, background: `${accentColor}20`, color: shadowColor }}>{forLabel}</span>
          )}
          {!noMeta && item.type && (
            <span style={{ ...styles.tag, background: '#e8f5e8', color: 'var(--green-dark)' }}>🎬 {item.type}</span>
          )}
          {item.created_at && (
            <span style={{ ...styles.tag, background: '#f5f5f5', color: '#aaa' }}>{timeAgo(item.created_at)}</span>
          )}
        </div>
      </div>
      <button style={styles.delBtn} onClick={() => onDelete(item.id)}>✕</button>
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 999 },
  form: { background: '#f9f9f9', borderRadius: 12, border: '2px solid #eee', padding: 10, marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 },
  byRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  byBtn: { fontSize: 13, fontWeight: 700, padding: '5px 10px', borderRadius: 8, border: '2px solid', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s' },
  inputRow: { display: 'flex', gap: 8 },
  addBtn: { padding: '8px 14px', border: '2px solid', borderRadius: 8, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', gap: 5 },
  item: { display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 8, border: '2px solid #eee', padding: '6px 10px', transition: 'opacity 0.2s', marginBottom: 5 },
  check: { width: 20, height: 20, borderRadius: 5, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' },
  itemContent: { flex: 1, minWidth: 0 },
  tags: { display: 'flex', gap: 5, marginTop: 2, flexWrap: 'wrap' },
  tag: { fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999 },
  delBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 13, flexShrink: 0 },
  doneHeader: { fontFamily: "'Press Start 2P', monospace", fontSize: 7, textAlign: 'center', margin: '8px 0 5px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 0' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '4px 0 0' },
  pageBtn: { background: 'white', border: '2px solid', borderRadius: 8, padding: '2px 10px', fontSize: 20, fontWeight: 800, cursor: 'pointer', lineHeight: 1.3, fontFamily: "'Nunito', sans-serif" },
  pageLabel: { fontFamily: "'Press Start 2P', monospace", fontSize: 8, fontWeight: 800, minWidth: 40, textAlign: 'center' },
}
