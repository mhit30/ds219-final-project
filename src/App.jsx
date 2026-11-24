import { useState } from 'react'
import AddExpenses from './AddExpenses.jsx'
import { useStored } from './storage.js'
import Budgets from './Budgets.jsx'
import Charts from './Charts.jsx'
import Chip from './Chip.jsx'

export default function App() {
  const [expenses, setExpenses] = useStored('expenses', [])
  const [budgets, setBudgets] = useStored('budgets', {})
  const latest = expenses.map(x => x.date.slice(0, 7)).sort().pop()
  const [month, setMonth] = useState(latest || new Date().toISOString().slice(0, 7))

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))
  const total = expenses.reduce((sum, x) => sum + x.amount, 0)

  return (
    <>
    <header><div><h1>Budget Tracker</h1><p>Track spending and stay on budget.</p></div></header>
    <main>
      <AddExpenses onAdd={rows => setExpenses(prev => [...prev, ...rows])} />
      <Budgets expenses={expenses} budgets={budgets} setBudgets={setBudgets} month={month} setMonth={setMonth} />
      <Charts expenses={expenses} budgets={budgets} month={month} />
      <section>
        <div className="head">
          <h2>Expenses <span className="muted">· {sorted.length} totaling ${total.toFixed(2)}</span></h2>
          {sorted.length > 0 && <button className="ghost" onClick={() => setExpenses([])}>Clear all</button>}
        </div>
        {sorted.length === 0 ? <p>No expenses yet.</p> : (
          <table>
            <thead><tr><th>Date</th><th>Category</th><th>Note</th><th className="num">Amount</th></tr></thead>
            <tbody>
              {sorted.map((x, i) => (
                <tr key={i}><td>{x.date}</td><td><Chip name={x.category} /></td><td className="muted">{x.note}</td><td className="num">${x.amount.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
    </>
  )
}
