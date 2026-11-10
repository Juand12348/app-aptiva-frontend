import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ComponentScore } from '../../api/types'
import ScoreTooltip from './ScoreTooltip'

// Recharts takes raw colors: keep in sync with --color-data / --color-paper-deep / --color-ink-muted.
const DATA = '#2b5ca8'
const GRID = '#d6e4f5'
const INK_MUTED = '#3e5878'
const INK = '#0e2240'

/** One series (score over 10 per component), so no legend: the section title names it. */
export default function ComponentBarChart({ components }: { components: ComponentScore[] }) {
  return (
    <>
      <div className="h-44" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={components} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 0 }}>
            <CartesianGrid horizontal={false} stroke={GRID} />
            <XAxis
              type="number"
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fill: INK_MUTED, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="component"
              width={118}
              tick={{ fill: INK, fontSize: 13, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ScoreTooltip />} cursor={{ fill: '#eaf2fb' }} />
            <Bar dataKey="score" fill={DATA} barSize={22} radius={[0, 4, 4, 0]} animationDuration={900}>
              <LabelList dataKey="score" position="right" fill={INK} fontSize={14} fontWeight={700} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Puntaje por componente, sobre 10</caption>
        <thead>
          <tr>
            <th scope="col">Componente</th>
            <th scope="col">Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {components.map((c) => (
            <tr key={c.component}>
              <th scope="row">{c.component}</th>
              <td>
                {c.score} de {c.max_score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
