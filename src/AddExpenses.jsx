import { useState } from 'react'
import { parseCsv } from './csv.js'
import ExpenseForm from './ExpenseForm.jsx'

export default function AddExpenses({ onAdd }) {
  const [tab, setTab] = useState('upload')
  const [message, setMessage] = useState('')

  const upload = async e => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const { expenses, skipped } = parseCsv(await file.text())
      onAdd(expenses)
      setMessage(`Imported ${expenses.length} expenses${skipped ? `, skipped ${skipped} invalid rows` : ''}.`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section>
      <div className="head">
        <h2>Add expenses</h2>
        <div className="tabs">
          <button className={tab === 'upload' ? 'on' : ''} onClick={() => setTab('upload')}>Upload CSV</button>
          <button className={tab === 'manual' ? 'on' : ''} onClick={() => setTab('manual')}>Add manually</button>
        </div>
      </div>
      {tab === 'upload' ? (
        <>
          <label className="drop">
            <input type="file" accept=".csv" onChange={upload} />
            <strong>Choose a CSV file</strong>
            <span className="muted">Columns: date, amount, category, note (optional)</span>
          </label>
          {message && <p className="muted">{message}</p>}
        </>
      ) : <ExpenseForm onAdd={x => onAdd([x])} />}
    </section>
  )
}
