const COLUMNS = ['date', 'amount', 'category', 'note']

// Splits one CSV line, allowing "quoted, fields".
const splitLine = line =>
  (line.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || [])
    .slice(0, -1)
    .map(f => f.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim())

export function validExpense({ date, amount, category, note = '' }) {
  const value = Number(amount)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) return null
  if (!amount || isNaN(value) || value <= 0 || !category) return null
  return { date, amount: value, category: category.trim(), note: note.trim() }
}

export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  const header = splitLine(lines[0] || '').map(h => h.toLowerCase())
  if (!COLUMNS.slice(0, 3).every(c => header.includes(c)))
    throw new Error('CSV header must include date, amount, category (note optional).')

  const expenses = []
  let skipped = 0
  for (const line of lines.slice(1)) {
    const cells = splitLine(line)
    const row = Object.fromEntries(header.map((h, i) => [h, cells[i] ?? '']))
    const expense = validExpense(row)
    expense ? expenses.push(expense) : skipped++
  }
  return { expenses, skipped }
}
