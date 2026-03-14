/**
 * DotDisplay — A vizuális pötty-rendszer
 *
 * Három mód:
 *  DotRatio    — X pöttyből Y világít (arány megjelenítése)
 *  PersonalDots — Te (borostyán) + az emberek, akiket hozol (ember)
 *  DotTree     — Elágazó fa a szorzó hatáshoz
 */

// ─── DotRatio ──────────────────────────────────────────────────────────────
// Megjeleníti `total` pöttyöt, amelyből `lit` darab világít.
export function DotRatio({ lit, total, maxVisible = 30, dotSize = 10 }) {
  const showCount = Math.min(total, maxVisible)
  const litCount = Math.min(lit, showCount)
  const truncated = total > maxVisible

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: showCount }, (_, i) => (
        <span
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: i < litCount ? 'var(--dot-lit)' : 'var(--dot-unlit)',
            display: 'inline-block',
            flexShrink: 0,
            boxShadow: i < litCount ? '0 0 6px rgba(255,74,28,0.45)' : 'none',
            transition: `background-color 0.25s ease ${Math.min(i * 18, 600)}ms,
                         box-shadow 0.25s ease ${Math.min(i * 18, 600)}ms`,
          }}
        />
      ))}
      {truncated && (
        <span style={{
          color: 'var(--warm-gray)',
          fontSize: 12,
          fontFamily: 'Crimson Pro, Georgia, serif',
          fontStyle: 'italic',
        }}>
          ...
        </span>
      )}
    </div>
  )
}

// ─── PersonalDots ──────────────────────────────────────────────────────────
// Te = borostyán (nagyobb), az általad hozott emberek = ember narancs
export function PersonalDots({ count, maxVisible = 28 }) {
  const clampedCount = Math.min(count, maxVisible)
  const showEllipsis = count > maxVisible

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Te — borostyán, kicsit nagyobb */}
      <span
        title="Te"
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: 'var(--dot-you)',
          display: 'inline-block',
          flexShrink: 0,
          boxShadow: '0 0 10px rgba(240,180,41,0.65)',
        }}
      />
      {/* Hozott emberek — ember narancs */}
      {Array.from({ length: clampedCount }, (_, i) => (
        <span
          key={i}
          style={{
            width: 11,
            height: 11,
            borderRadius: '50%',
            backgroundColor: 'var(--dot-lit)',
            display: 'inline-block',
            flexShrink: 0,
            boxShadow: '0 0 5px rgba(255,74,28,0.4)',
            animation: `dotFadeIn 0.3s ease ${i * 45}ms both`,
          }}
        />
      ))}
      {showEllipsis && (
        <span style={{
          color: 'var(--warm-gray)',
          fontSize: 11,
          fontFamily: 'Crimson Pro, Georgia, serif',
          fontStyle: 'italic',
        }}>
          +{count - maxVisible}
        </span>
      )}
    </div>
  )
}

// ─── DotTree ───────────────────────────────────────────────────────────────
// Elágazó fa: te (borostyán gyökér) → hozol `branches` embert → ők is hoznak...
export function DotTree({ branches, maxDots = 40 }) {
  if (branches <= 0) return null

  const SVG_W = 260
  const LEVEL_H = 52
  const DOT_R = 5
  const ROOT_R = 8

  const { levels, truncated } = buildTreeLevels(branches, maxDots)
  const svgHeight = levels.length * LEVEL_H + (truncated ? 36 : 14)

  // x,y pozíciók kiszámítása szintenként
  const positionedLevels = levels.map((level, li) => {
    const y = li * LEVEL_H + 14
    const n = level.length

    let xPositions
    if (n === 1) {
      xPositions = [SVG_W / 2]
    } else {
      const spacing = Math.min(28, (SVG_W - 20) / (n - 1))
      const totalW = (n - 1) * spacing
      const startX = (SVG_W - totalW) / 2
      xPositions = Array.from({ length: n }, (_, i) => startX + i * spacing)
    }

    return level.map((node, ni) => ({ ...node, x: xPositions[ni], y }))
  })

  // Élek: minden csomópont a szülőjéhez kapcsolódik
  const edges = []
  positionedLevels.forEach((level, li) => {
    if (li === 0) return
    const parentLevel = positionedLevels[li - 1]
    level.forEach((node) => {
      const parent = parentLevel[node.parentIndex]
      if (parent) {
        edges.push({
          x1: parent.x, y1: parent.y,
          x2: node.x, y2: node.y,
          partial: node.partial,
        })
      }
    })
  })

  const allNodes = positionedLevels.flat()

  return (
    <svg
      width={SVG_W}
      height={svgHeight}
      style={{ overflow: 'visible', display: 'block' }}
    >
      {/* Élek */}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1} y1={e.y1}
          x2={e.x2} y2={e.y2}
          stroke="var(--surface-border)"
          strokeWidth={1.5}
          opacity={e.partial ? 0.35 : 0.85}
        />
      ))}

      {/* Csomópontok */}
      {allNodes.map((node) => {
        const isRoot = node.id === 0
        const r = isRoot ? ROOT_R : DOT_R
        return (
          <g key={node.id}>
            {isRoot && (
              <circle
                cx={node.x} cy={node.y} r={r + 5}
                fill="none"
                stroke="var(--dot-you)"
                strokeWidth={1}
                opacity={0.3}
              />
            )}
            <circle
              cx={node.x} cy={node.y} r={r}
              fill={isRoot ? 'var(--dot-you)' : 'var(--dot-lit)'}
              opacity={node.partial ? 0.45 : 1}
            />
          </g>
        )
      })}

      {/* Csonkítás jelzése */}
      {truncated && (
        <g>
          {[-14, 0, 14].map((offset, i) => (
            <circle
              key={i}
              cx={SVG_W / 2 + offset}
              cy={svgHeight - 20}
              r={2.5}
              fill="var(--warm-gray)"
              opacity={0.5}
            />
          ))}
          <text
            x={SVG_W / 2}
            y={svgHeight - 4}
            textAnchor="middle"
            fill="var(--warm-gray)"
            fontSize={11}
            fontFamily="Crimson Pro, Georgia, serif"
            fontStyle="italic"
          >
            és így tovább
          </text>
        </g>
      )}
    </svg>
  )
}

// ─── Belső segédfüggvény ────────────────────────────────────────────────────
// Limit nodes per level so dots don't overlap in 260px SVG width.
// Dot radius=5, need ~14px center-to-center → max ~18 nodes/row.
const MAX_NODES_PER_ROW = 18

function buildTreeLevels(branches, maxDots) {
  const levels = [[{ id: 0, parentIndex: 0, partial: false }]]
  let total = 1
  let truncated = false
  const maxDepth = 4

  while (total < maxDots && levels.length < maxDepth) {
    const prevLevel = levels[levels.length - 1]
    const nextCount = prevLevel.length * branches

    if (nextCount === 0) break

    const remaining = maxDots - total
    // Cap by visual fit AND remaining budget
    const canShow = Math.min(nextCount, remaining, MAX_NODES_PER_ROW)

    if (nextCount > canShow) {
      // Partial level — show as many as fit
      if (canShow > 0) {
        const partial = Array.from({ length: canShow }, (_, i) => ({
          id: total + i,
          parentIndex: Math.floor(i / branches),
          partial: true,
        }))
        levels.push(partial)
      }
      truncated = true
      break
    }

    const nextLevel = Array.from({ length: nextCount }, (_, i) => ({
      id: total + i,
      parentIndex: Math.floor(i / branches),
      partial: false,
    }))
    levels.push(nextLevel)
    total += nextCount
  }

  if (levels.length >= maxDepth) truncated = true

  return { levels, truncated }
}
