import { useState, useEffect } from 'react'
import { getAllEvents, exportToCSV, exportToJSON } from '../db.js'
import { SPECIES, EVENT_TYPES } from '../constants.js'

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function RecordsView({ onNavigate }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    getAllEvents().then(setEvents)
  }, [])

  async function handleCSV() {
    const csv = await exportToCSV()
    download(csv, `ffcm_${Date.now()}.csv`, 'text/csv')
  }

  async function handleJSON() {
    const json = await exportToJSON()
    download(json, `ffcm_${Date.now()}.json`, 'application/json')
  }

  function getSpeciesCommon(code) {
    return SPECIES.find((s) => s.code === code)?.common ?? code
  }

  function getEventLabel(code) {
    return EVENT_TYPES.find((t) => t.code === code)?.label ?? code
  }

  return (
    <div className="view">
      <div className="view-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Volver
        </button>
        <h2>Historial ({events.length})</h2>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          Sin registros aún.<br />
          Captura tu primer evento.
        </div>
      ) : (
        <div className="records-list">
          {events.map((e) => (
            <div key={e.id} className="record-card">
              <div className="rec-top">
                <span className="rec-species">
                  {e.species} — {getSpeciesCommon(e.species)}
                </span>
                <span className={`sync-badge ${e.synced ? 'synced' : 'pending'}`}>
                  {e.synced ? 'sync' : 'local'}
                </span>
              </div>
              <div className="rec-detail">
                {e.beach} · {getEventLabel(e.eventType)}
                {e.nestZone ? ` · ${e.nestZone}` : ''}
              </div>
              {e.eggCount != null && (
                <div className="rec-detail">{e.eggCount} huevos</div>
              )}
              {e.nestId && <div className="rec-detail">ID: {e.nestId}</div>}
              {e.observer && <div className="rec-detail">Obs: {e.observer}</div>}
              {e.notes && <div className="rec-notes">{e.notes}</div>}
              <div className="rec-detail" style={{ marginTop: '0.2rem', fontSize: '0.7rem' }}>
                {new Date(e.createdAt).toLocaleString('es-MX')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="export-bar">
        <button className="export-btn" onClick={handleCSV}>
          Exportar CSV
        </button>
        <button className="export-btn" onClick={handleJSON}>
          Exportar JSON
        </button>
      </div>
    </div>
  )
}
