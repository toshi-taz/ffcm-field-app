import { useState, useEffect } from 'react'
import { getAllEvents, getUnsyncedEvents } from '../db.js'

export default function HomeView({ onNavigate }) {
  const [time, setTime] = useState(new Date())
  const [stats, setStats] = useState({ tonight: 0, total: 0, pending: 0 })

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    async function loadStats() {
      const [all, unsynced] = await Promise.all([getAllEvents(), getUnsyncedEvents()])
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const tonight = all.filter((e) => e.timestamp >= todayStart.getTime()).length
      setStats({ tonight, total: all.length, pending: unsynced.length })
    }
    loadStats()
  }, [])

  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const dateStr = time.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="view">
      <div className="time-display">
        <div className="clock">{hh}:{mm}</div>
        <div className="date-str">{dateStr}</div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.tonight}</div>
          <div className="stat-label">Esta noche</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pendientes</div>
        </div>
      </div>

      <div className="btn-row">
        <button className="big-btn primary" onClick={() => onNavigate('new')}>
          + Nuevo Registro
        </button>
        <button className="big-btn" onClick={() => onNavigate('records')}>
          Historial
        </button>
      </div>

      <footer className="app-footer">
        FFCM CAMPAMENTOS TORTUGUEROS<br />
        xcacel-xcacelito · quintana roo
      </footer>
    </div>
  )
}
