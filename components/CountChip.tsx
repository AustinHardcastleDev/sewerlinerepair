/**
 * Metro and state grid counts. Real counts get the yellow chip; zero and
 * near-zero counts drop to plain faint text so empty cells stay quiet.
 */
export function CountChip({
  count,
  threshold = 1,
  suffix,
}: {
  count: number
  /** Counts below this render without the chip. */
  threshold?: number
  suffix?: string
}) {
  const value = count.toLocaleString()
  const text = suffix ? `${value} ${suffix}` : value

  if (count < threshold) {
    return <span className="count-empty">{text}</span>
  }

  return <span className="count-chip">{text}</span>
}
