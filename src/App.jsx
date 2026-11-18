import { useState } from 'react'
import { openCsv, newCsv, saveCsv } from './csv'
import EntryForm from './components/EntryForm'
import EntryList from './components/EntryList'
import { CATEGORIES } from './categories'

export default function App() {
  const [file, setFile] = useState(null)
  const [rows, setRows] = useState([])

  const load = (fn) => async () => {
    try {
      const { handle, rows } = await fn()
      setFile({ handle }); setRows(rows)
    } catch { /* picker cancelled */ }
  }

  const categories = [...new Set([...CATEGORIES, ...rows.map((r) => r.category)])]

  const update = (next) => {
    next.sort((a, b) => b.date.localeCompare(a.date))
    setRows(next)
    if (file.handle) saveCsv(file.handle, next)
  }

  return (
    <main className="app">
      <h1>Budget Tracker</h1>
      <div className="toolbar">
        <button onClick={load(openCsv)}>Open CSV</button>
        <button onClick={load(newCsv)}>New CSV</button>
        {file && !file.handle && <button onClick={() => saveCsv(null, rows)}>Download CSV</button>}
      </div>
      {file && (
        <>
          <EntryForm categories={categories} onAdd={(r) => update([...rows, r])} />
          <EntryList rows={rows} onDelete={(i) => update(rows.filter((_, j) => j !== i))} />
        </>
      )}
    </main>
  )
}
