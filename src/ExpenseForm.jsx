import { useState } from 'react'
import { validExpense } from './csv.js'

const empty = { date: new Date().toISOString().slice(0, 10), amount: '', category: '', note: '' }

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const set = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = e => {
    e.preventDefault()
    const expense = validExpense(form)
    if (!expense) return setError('Enter a valid date, a positive amount and a category.')
    onAdd(expense)
    setForm({ ...empty, date: form.date })
    setError('')
  }

  return (
    <form onSubmit={submit} className="inline-form">
      <input type="date" name="date" value={form.date} onChange={set} />
      <input type="number" name="amount" step="0.01" placeholder="Amount" value={form.amount} onChange={set} />
      <input name="category" placeholder="Category" value={form.category} onChange={set} />
      <input name="note" placeholder="Note (optional)" value={form.note} onChange={set} />
      <button>Add</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
