import { useState } from 'react'
import { BEACHES, SPECIES, EVENT_TYPES, NEST_ZONES } from '../constants.js'
import { saveEvent } from '../db.js'

export default function NewEventView({ onNavigate }) {
  const [species, setSpecies] = useState('')
  const [eventType, setEventType] = useState('')
  const [beach, setBeach] = useState('')
  const [nestZone, setNestZone] = useState('')
  const [eggCount, setEggCount] = useState('')
  const [trackWidth, setTrackWidth] = useState('')
  const [nestId, setNestId] = useState('')
  const [observer, setObserver] = useState('')
  const [notes, setNotes] = useState('')
  const [showFlash, setShowFlash] = useState(false)

  const needsEggCount =
    eventType === 'nesting_success' || eventType === 'nest_relocation'

  const canSave = beach && species && eventType

  async function handleSave() {
    await saveEvent({
      species,
      eventType,
      beach,
      nestZone,
      eggCount: eggCount ? Number(eggCount) : null,
      trackWidth: trackWidth ? Number(trackWidth) : null,
      nestId,
      observer: observer.toUpperCase(),
      notes,
    })
    setShowFlash(true)
    setTimeout(() => {
      setShowFlash(false)
      onNavigate('home')
    }, 1200)
  }

  return (
    <div className="view">
      <div className="view-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Volver
        </button>
        <h2>Nuevo Registro</h2>
      </div>

      <div className="view-content">
        <div className="form-group">
          <label className="form-label">Especie</label>
          <div className="chip-grid">
            {SPECIES.map((s) => (
              <button
                key={s.code}
                className={`chip${species === s.code ? ' selected' : ''}`}
                onClick={() => setSpecies(s.code)}
                type="button"
              >
                <strong>{s.label}</strong>
                <br />
                <span style={{ fontSize: '0.7rem' }}>{s.common}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Evento</label>
          <div className="chip-grid">
            {EVENT_TYPES.map((t) => (
              <button
                key={t.code}
                className={`chip${eventType === t.code ? ' selected' : ''}`}
                onClick={() => setEventType(t.code)}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Playa</label>
          <select
            className="form-select"
            value={beach}
            onChange={(e) => setBeach(e.target.value)}
          >
            <option value="">— seleccionar —</option>
            {BEACHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Zona de anidación</label>
          <div className="chip-grid">
            {NEST_ZONES.map((z) => (
              <button
                key={z}
                className={`chip${nestZone === z ? ' selected' : ''}`}
                onClick={() => setNestZone(z)}
                type="button"
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {needsEggCount && (
          <div className="form-group">
            <label className="form-label">Número de huevos</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={eggCount}
              onChange={(e) => setEggCount(e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Ancho de rastro (cm)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={trackWidth}
            onChange={(e) => setTrackWidth(e.target.value)}
            placeholder="ej. 85"
          />
        </div>

        <div className="form-group">
          <label className="form-label">ID de nido</label>
          <input
            className="form-input"
            type="text"
            value={nestId}
            onChange={(e) => setNestId(e.target.value)}
            placeholder="ej. XCA-2026-001"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Iniciales del observador</label>
          <input
            className="form-input"
            type="text"
            maxLength={5}
            value={observer}
            onChange={(e) => setObserver(e.target.value.toUpperCase())}
            placeholder="ej. AGB"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notas</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones adicionales..."
          />
        </div>

        <button className="save-btn" disabled={!canSave} onClick={handleSave}>
          Guardar Registro
        </button>
      </div>

      {showFlash && (
        <div className="success-flash">
          <div className="success-flash-inner">REGISTRO GUARDADO</div>
        </div>
      )}
    </div>
  )
}
