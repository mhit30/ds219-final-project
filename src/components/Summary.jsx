const money = (n) => `$${n.toFixed(2)}`

// Sum amounts grouped by key, largest first
const totals = (rows, key) =>
  Object.entries(rows.reduce((t, r) => ({ ...t, [r[key]]: (t[r[key]] ?? 0) + r.amount }), {}))

export default function Summary({ rows }) {
  if (!rows.length) return null
  const total = rows.reduce((s, r) => s + r.amount, 0)
  const byCategory = totals(rows, 'category').sort((a, b) => b[1] - a[1])
  const byDay = totals(rows, 'date').sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div className="summary">
      <section className="card">
        <h3>By category</h3>
        <table>
          <tbody>
            {byCategory.map(([c, amt]) => (
              <tr key={c}><td>{c}</td><td>{money(amt)}</td><td>{Math.round((amt / total) * 100)}%</td></tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="card">
        <h3>By day</h3>
        <table>
          <tbody>
            {byDay.map(([d, amt]) => <tr key={d}><td>{d}</td><td>{money(amt)}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  )
}
