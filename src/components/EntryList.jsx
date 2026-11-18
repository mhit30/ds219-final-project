export default function EntryList({ rows, onDelete }) {
  if (!rows.length) return <p className="card">No spending yet.</p>
  return (
    <table className="card">
      <thead>
        <tr><th>Date</th><th>Category</th><th>Note</th><th>Amount</th><th /></tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.date}</td><td>{r.category}</td><td>{r.note}</td>
            <td>${r.amount.toFixed(2)}</td>
            <td><button onClick={() => onDelete(r)}>✕</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
