import { useState } from 'react'
import { CUSTOM } from '../categories'

const today = () => new Date().toISOString().slice(0, 10)

export default function EntryForm({ categories, onAdd }) {
  const blank = (date = today()) => ({ date, amount: '', category: categories[0], custom: '', note: '' })
  const [entry, setEntry] = useState(blank)
  const set = (key) => (e) => setEntry({ ...entry, [key]: e.target.value })
  const isCustom = entry.category === CUSTOM

  const submit = (e) => {
    e.preventDefault()
    const { custom, ...row } = entry
    onAdd({ ...row, amount: Number(row.amount), category: isCustom ? custom.trim() : row.category })
    setEntry(blank(entry.date))
  }

  return (
    <form className="card form" onSubmit={submit}>
      <input type="date" value={entry.date} onChange={set('date')} required />
      <input type="number" step="0.01" min="0.01" placeholder="Amount" value={entry.amount} onChange={set('amount')} required />
      <select value={entry.category} onChange={set('category')}>
        {[...categories, CUSTOM].map((c) => <option key={c}>{c}</option>)}
      </select>
      {isCustom && <input placeholder="Custom category" value={entry.custom} onChange={set('custom')} required />}
      <input placeholder="Note (optional)" value={entry.note} onChange={set('note')} />
      <button>Add</button>
    </form>
  )
}
