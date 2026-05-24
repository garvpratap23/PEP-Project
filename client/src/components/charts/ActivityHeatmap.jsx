import { useMemo } from 'react';
import { generateHeatmapData } from '../../utils/mockData';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ActivityHeatmap({ data }) {
  const cells = useMemo(() => data || generateHeatmapData(), [data]);

  return (
    <div id="activity-heatmap">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 18 }}>
          {DAYS.map((d, i) => (
            <div key={d} style={{
              height: 12,
              fontSize: 9,
              color: 'var(--text-muted)',
              lineHeight: '12px',
              textAlign: 'right',
              visibility: i % 2 === 0 ? 'visible' : 'hidden',
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(52, 12px)', gap: 2 }}>
            {cells.map((cell, idx) => {
              const level = cell.count === 0 ? 0 : cell.count <= 2 ? 1 : cell.count <= 4 ? 2 : cell.count <= 6 ? 3 : 4;
              return (
                <div
                  key={idx}
                  className="heatmap-cell"
                  data-level={level}
                  style={{ gridRow: cell.day + 1, gridColumn: cell.week + 1 }}
                  title={`${cell.count} contribution${cell.count !== 1 ? 's' : ''}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className="heatmap-cell" data-level={level} style={{ position: 'relative' }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  );
}
