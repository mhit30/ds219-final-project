import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, ReferenceLine } from 'recharts'

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b']
const money = (n) => `$${n.toFixed(2)}`

export default function Charts({ rows, month, budget }) {
  if (!rows.length) return null
  const [y, m] = month.split('-').map(Number)
  const days = new Date(y, m, 0).getDate()

  const byCategory = Object.entries(rows.reduce((t, r) => ({ ...t, [r.category]: (t[r.category] ?? 0) + r.amount }), {}))
    .map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  // One entry per day of the month, with a running total
  let running = 0
  const daily = Array.from({ length: days }, (_, i) => {
    const date = `${month}-${String(i + 1).padStart(2, '0')}`
    const spent = rows.filter((r) => r.date === date).reduce((s, r) => s + r.amount, 0)
    return { day: i + 1, spent, total: (running += spent) }
  })

  return (
    <div className="summary charts">
      <section className="card">
        <h3>Spending by category</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={80} label={({ name }) => name}>
              {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={money} />
          </PieChart>
        </ResponsiveContainer>
      </section>
      <section className="card">
        <h3>Daily spending</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={daily}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={money} labelFormatter={(d) => `Day ${d}`} />
            <Bar dataKey="spent" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>
      <section className="card wide">
        <h3>Running total vs budget</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={daily}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, (max) => Math.ceil(Math.max(max, budget ?? 0) * 1.1)]} />
            <Tooltip formatter={money} labelFormatter={(d) => `Day ${d}`} />
            <Line dataKey="total" stroke="#3b82f6" dot={false} />
            {budget > 0 && <ReferenceLine y={budget} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Budget", position: "insideTopRight" }} />}
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
