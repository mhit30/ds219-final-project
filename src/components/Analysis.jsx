const money = (n) => `$${n.toFixed(2)}`

export default function Analysis({ rows, month, budget, prevTotal }) {
  if (!rows.length) return null
  const [y, m] = month.split('-').map(Number)
  const days = new Date(y, m, 0).getDate()
  const now = new Date().toISOString().slice(0, 7)
  // Days elapsed: whole month for past months, today's date for the current month
  const elapsed = month === now ? new Date().getDate() : days

  const total = rows.reduce((s, r) => s + r.amount, 0)
  const avg = total / elapsed
  const projected = avg * days
  const top = Object.entries(rows.reduce((t, r) => ({ ...t, [r.category]: (t[r.category] ?? 0) + r.amount }), {}))
    .sort((a, b) => b[1] - a[1])[0]
  const biggest = rows.reduce((a, b) => (b.amount > a.amount ? b : a))

  const insights = [
    `Average spending is ${money(avg)} per day.`,
    `${top[0]} is your top category at ${money(top[1])} (${Math.round((top[1] / total) * 100)}% of spending).`,
    `Your biggest purchase was ${money(biggest.amount)} on ${biggest.date} (${biggest.category}${biggest.note ? `, ${biggest.note}` : ''}).`,
    month === now && `At this pace you'll spend about ${money(projected)} this month` +
      (budget ? `, which is ${money(Math.abs(budget - projected))} ${projected > budget ? 'over' : 'under'} budget.` : '.'),
    prevTotal > 0 && `So far that's ${Math.round(Math.abs(total / prevTotal - 1) * 100)}% ${total > prevTotal ? 'more' : 'less'} than last month (${money(prevTotal)}).`,
  ].filter(Boolean)

  return (
    <section className="card">
      <h3>Analysis</h3>
      <ul>{insights.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  )
}
