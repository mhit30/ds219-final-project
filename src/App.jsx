import { useState } from 'react'
import { parseCsv } from './csv.js'
import ExpenseForm from './ExpenseForm.jsx'
import { useStored } from './storage.js'
import Budgets from './Budgets.jsx'

export default function App() {
  const [expenses, setExpenses] = useStored('expenses', [])
  const [budgets, setBudgets] = useStored('budgets', {})
  const [message, setMessage] = useState('')

  const upload = async e => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const { expenses: rows, skipped } = parseCsv(await file.text())
      setExpenses(prev => [...prev, ...rows])
      setMessage(`Imported ${rows.length} expenses${skipped ? `, skipped ${skipped} invalid rows` : ''}.`)
    } catch (err) {
      setMessage(err.message)
    }
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main>
      <h1>Budget Tracker</h1>
      <section>
        <h2>Add expenses</h2>
        <label className="row">
          Upload CSV (date, amount, category, note): <input type="file" accept=".csv" onChange={upload} />
        </label>
        {message && <p>{message}</p>}
        <ExpenseForm onAdd={x => setExpenses(prev => [...prev, x])} />
      </section>
      <Budgets expenses={expenses} budgets={budgets} setBudgets={setBudgets} />
      <section>
        <div className="row">
          <h2>Expenses</h2>
          {sorted.length > 0 && <button onClick={() => setExpenses([])}>Clear all</button>}
        </div>
        {sorted.length === 0 ? <p>No expenses yet.</p> : (
          <table>
            <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Note</th></tr></thead>
            <tbody>
              {sorted.map((x, i) => (
                <tr key={i}><td>{x.date}</td><td>{x.category}</td><td>${x.amount.toFixed(2)}</td><td>{x.note}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
