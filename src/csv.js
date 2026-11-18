import Papa from 'papaparse'

const types = [{ description: 'CSV file', accept: { 'text/csv': ['.csv'] } }]
const supported = 'showOpenFilePicker' in window

export const parseCsv = (text) =>
  Papa.parse(text, { header: true, skipEmptyLines: true }).data
    .map((r) => ({ ...r, amount: Number(r.amount) }))

export async function openCsv() {
  if (!supported) return { handle: null, rows: parseCsv(await pickFile()) }
  const [handle] = await window.showOpenFilePicker({ types })
  return { handle, rows: parseCsv(await (await handle.getFile()).text()) }
}

export async function newCsv() {
  if (!supported) return { handle: null, rows: [] }
  const handle = await window.showSaveFilePicker({ suggestedName: 'spending.csv', types })
  await saveCsv(handle, [])
  return { handle, rows: [] }
}

export async function saveCsv(handle, rows) {
  const text = Papa.unparse(rows, { columns: ['date', 'amount', 'category', 'note'] })
  if (!handle) return download(text)
  const writable = await handle.createWritable()
  await writable.write(text)
  await writable.close()
}

function pickFile() {
  return new Promise((resolve) => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.csv' })
    input.onchange = () => input.files[0].text().then(resolve)
    input.click()
  })
}

function download(text) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }))
  a.download = 'spending.csv'
  a.click()
}
