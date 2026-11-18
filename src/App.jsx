import { useState } from 'react'
import { openCsv, newCsv, saveCsv } from './csv'
import EntryForm from './components/EntryForm'
import EntryList from './components/EntryList'
import Budget from './components/Budget'
import Summary from './components/Summary'
import { CATEGORIES } from './categories'

// Budget rows are stored in the CSV with a month-only date (YYYY-MM)
const isBudget = (r) => r.date.length === 7

export default function App() {
  const [file, setFile] = useState(null)
  const [rows, setRows] = useState([])
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  const load = (fn) => async () => {
    try {
      const { handle, rows } = await fn()
      setFile({ handle }); setRows(rows)
    } catch { /* picker cancelled */ }
  }

  const spending = rows.filter((r) => !isBudget(r))
  const monthRows = spending.filter((r) => r.date.startsWith(month))
  const budget = rows.find((r) => isBudget(r) && r.date === month)
  const categories = [...new Set([...CATEGORIES, ...spending.map((r) => r.category)])]

  const update = (next) => {
    next.sort((a, b) => b.date.localeCompare(a.date))
    setRows(next)
    if (file.handle) saveCsv(file.handle, next)
  }

  const setBudget = (amount) =>
    update([...rows.filter((r) => r !== budget), { date: month, amount, category: 'Budget', note: '' }])

  return (
    <main className="app">
      <h1>Budget Tracker</h1>
      <div className="toolbar">
        <button onClick={load(openCsv)}>Open CSV</button>
        <button onClick={load(newCsv)}>New CSV</button>
        {file && !file.handle && <button onClick={() => saveCsv(null, rows)}>Download CSV</button>}
        {file && <input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />}
      </div>
      {file && (
        <>
          <Budget budget={budget?.amount} spent={monthRows.reduce((s, r) => s + r.amount, 0)} onSet={setBudget} />
          <Summary rows={monthRows} />
          <EntryForm categories={categories} onAdd={(r) => update([...rows, r])} />
          <EntryList rows={monthRows} onDelete={(row) => update(rows.filter((r) => r !== row))} />
        </>
      )}
    </main>
  )
}
