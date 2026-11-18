import { useState } from 'react'

export default function Budget({ budget, spent, onSet }) {
  const [input, setInput] = useState('')
  const left = (budget ?? 0) - spent
  const pct = budget ? Math.min(100, (spent / budget) * 100) : 0
  const over = left < 0 ? 'over' : ''

  const submit = (e) => {
    e.preventDefault()
    onSet(Number(input))
    setInput('')
  }

  return (
    <section className="card">
      <form className="form" onSubmit={submit}>
        <input type="number" step="0.01" min="0" placeholder={budget ? `Budget: $${budget}` : 'Set monthly budget'}
          value={input} onChange={(e) => setInput(e.target.value)} required />
        <button>{budget ? 'Update' : 'Set'} budget</button>
      </form>
      {budget > 0 && (
        <>
          <p>Spent ${spent.toFixed(2)} of ${budget.toFixed(2)} · <b className={over}>
            ${Math.abs(left).toFixed(2)} {over || 'left'}</b></p>
          <div className="bar"><div style={{ width: `${pct}%` }} className={over} /></div>
        </>
      )}
    </section>
  )
}
