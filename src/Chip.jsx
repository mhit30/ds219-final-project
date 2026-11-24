// Colored pill for a category; hue is derived from the name so colors stay stable.
export default function Chip({ name }) {
  const hue = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)
  return <span className="chip" style={{ background: `hsl(${hue} 70% 92%)`, color: `hsl(${hue} 55% 30%)` }}>{name}</span>
}
