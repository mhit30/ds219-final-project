import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const money = n => `$${n.toFixed(2)}`

export default function Charts({ expenses, budgets, month }) {
  const inMonth = expenses.filter(x => x.date.startsWith(month))
  if (inMonth.length === 0) return <section><div className="head"><h2>Charts</h2></div><p className="muted">No expenses in {month}.</p></section>

  const byCategory = {}
  const byDay = {}
  for (const x of inMonth) {
    byCategory[x.category] = (byCategory[x.category] || 0) + x.amount
    const day = Number(x.date.slice(8))
    byDay[day] = (byDay[day] || 0) + x.amount
  }
  const categoryData = Object.keys(byCategory).sort().map(c => ({ category: c, Spent: byCategory[c], Budget: budgets[c] ?? 0 }))
  const days = new Date(month.slice(0, 4), month.slice(5), 0).getDate()
  const dayData = Array.from({ length: days }, (_, i) => ({ day: i + 1, Spent: byDay[i + 1] || 0 }))

  return (
    <section>
      <div className="head"><h2>Charts</h2></div>
      <h3>Spent vs budget by category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip formatter={money} />
          <Legend />
          <Bar dataKey="Spent" fill="#2a9d8f" />
          <Bar dataKey="Budget" fill="#d9d2c3" />
        </BarChart>
      </ResponsiveContainer>
      <h3>Spending by day</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={dayData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={money} labelFormatter={d => `${month}-${String(d).padStart(2, '0')}`} />
          <Bar dataKey="Spent" fill="#2a9d8f" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
