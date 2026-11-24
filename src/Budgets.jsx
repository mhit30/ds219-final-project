import { useState } from 'react'

const money = n => `$${n.toFixed(2)}`
const sum = (obj, keys) => keys.reduce((total, k) => total + (obj[k] || 0), 0)

export default function Budgets({ expenses, budgets, setBudgets }) {
  const latest = expenses.map(x => x.date.slice(0, 7)).sort().pop()
  const [month, setMonth] = useState(latest || new Date().toISOString().slice(0, 7))
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
      <div className="row">
        <h2>Monthly budgets</h2>
        <input type="month" value={month} onChange={e => e.target.value && setMonth(e.target.value)} />
      </div>
      {categories.length === 0 ? <p>No categories yet. Add expenses or a budget category.</p> : (
        <table>
          <thead><tr><th>Category</th><th>Spent</th><th>Budget</th><th>Remaining</th></tr></thead>
          <tbody>
            {categories.map(c => {
              const left = budgets[c] == null ? null : budgets[c] - (spent[c] || 0)
              return (
                <tr key={c}>
                  <td>{c}</td>
                  <td>{money(spent[c] || 0)}</td>
                  <td><input type="number" min="0" step="0.01" placeholder="No budget" value={budgets[c] ?? ''} onChange={e => setBudget(c, e.target.value)} /></td>
                  <td className={left < 0 ? 'error' : ''}>{left == null ? '-' : left < 0 ? `${money(-left)} over` : money(left)}</td>
                </tr>
              )
            })}
            <tr className="total">
              <td>Total</td><td>{money(sum(spent, categories))}</td><td>{money(sum(budgets, categories))}</td><td />
            </tr>
          </tbody>
        </table>
      )}
      <form onSubmit={addCategory} className="row">
        <input placeholder="New budget category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
        <button>Add category</button>
      </form>
    </section>
  )
}
