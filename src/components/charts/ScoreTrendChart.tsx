import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDate, formatShortDate } from '../../lib/format'
import TrendTooltip, { type TrendPoint } from './TrendTooltip'

// Recharts takes raw colors: keep in sync with --color-data / --color-paper-deep / --color-ink-muted.
const DATA = '#2b5ca8'
const GRID = '#d6e4f5'
const INK_MUTED = '#3e5878'

/** One series (total score per exam, oldest → newest), so no legend: the section title names it. */
export default function ScoreTrendChart({ points }: { points: TrendPoint[] }) {
  return (
    <>
      <div className="h-56" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 12, right: 16, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="n"
              tickFormatter={(n: number) => formatShortDate(points[n - 1]?.date ?? '')}
              tick={{ fill: INK_MUTED, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              minTickGap={16}
            />
            <YAxis
              domain={[0, 30]}
              ticks={[0, 10, 20, 30]}
              tick={{ fill: INK_MUTED, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: INK_MUTED, strokeDasharray: '4 4' }} />
            <Line
              type="linear"
              dataKey="score"
              stroke={DATA}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={{ r: 5, fill: DATA, stroke: '#ffffff', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: DATA, stroke: '#ffffff', strokeWidth: 2 }}
              animationDuration={1100}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* A <table> ignores the 1px sr-only box; a block wrapper keeps it from widening the page. */}
      <div className="sr-only">
        <table>
          <caption>Puntaje total por examen, del más antiguo al más reciente</caption>
          <thead>
            <tr>
              <th scope="col">Examen</th>
              <th scope="col">Fecha</th>
              <th scope="col">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.n}>
                <th scope="row">{p.n}</th>
                <td>{formatDate(p.date)}</td>
                <td>
                  {p.score} de {p.max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
