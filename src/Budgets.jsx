import { useState } from 'react'
import Chip from './Chip.jsx'

const money = n => `$${n.toFixed(2)}`
const sum = (obj, keys) => keys.reduce((total, k) => total + (obj[k] || 0), 0)

export default function Budgets({ expenses, budgets, setBudgets, month, setMonth }) {
  const [newCategory, setNewCategory] = useState('')

  const spent = {}
  for (const x of expenses) if (x.date.startsWith(month)) spent[x.category] = (spent[x.category] || 0) + x.amount
  const categories = [...new Set([...Object.keys(budgets), ...Object.keys(spent)])].sort()

  const setBudget = (category, value) => {
    const amount = value === '' ? null : Number(value)
    const { [category]: _, ...rest } = budgets
    setBudgets(amount == null || isNaN(amount) || amount < 0 ? rest : { ...rest, [category]: amount })
  }

  const addCategory = e => {
    e.preventDefault()
    const name = newCategory.trim()
    if (name && !(name in budgets)) setBudgets({ ...budgets, [name]: 0 })
    setNewCategory('')
  }

  return (
    <section>
      <div className="head">
        <div>
          <h2>Monthly budgets</h2>
          <p className="muted sub">Set a budget once per category; it applies to every month.</p>
        </div>
        <label className="row muted">Viewing <input type="month" value={month} onChange={e => e.target.value && setMonth(e.target.value)} /></label>
      </div>
      {categories.length === 0 ? <p>No categories yet. Add expenses or a budget category.</p> : (
        <table>
          <thead><tr><th>Category</th><th className="num">Spent this month</th><th className="num">Budget (every month)</th><th className="num">Remaining</th></tr></thead>
          <tbody>
            {categories.map(c => {
              const left = budgets[c] == null ? null : budgets[c] - (spent[c] || 0)
              return (
                <tr key={c}>
                  <td><Chip name={c} /></td>
                  <td className="num">{money(spent[c] || 0)}</td>
                  <td className="num"><input type="number" min="0" step="0.01" placeholder="No budget" value={budgets[c] ?? ''} onChange={e => setBudget(c, e.target.value)} /></td>
                  <td className={left < 0 ? 'num error' : 'num'}>{left == null ? '-' : left < 0 ? `${money(-left)} over` : money(left)}</td>
                </tr>
              )
            })}
            <tr className="total">
              <td>Total</td><td className="num">{money(sum(spent, categories))}</td><td className="num">{money(sum(budgets, categories))}</td><td />
            </tr>
          </tbody>
        </table>
      )}
      <form onSubmit={addCategory} className="row" style={{ marginTop: 12 }}>
        <input placeholder="New budget category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
        <button>Add category</button>
      </form>
    </section>
  )
}
