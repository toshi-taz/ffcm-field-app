const DB_NAME = 'ffcm_db'
const STORE_NAME = 'events'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('synced', 'synced', { unique: false })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

function generateId() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export async function saveEvent(data) {
  const db = await openDB()
  const record = {
    ...data,
    id: generateId(),
    synced: false,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).add(record)
    tx.oncomplete = () => resolve(record)
    tx.onerror = (e) => reject(e.target.error)
  })
}

export async function getAllEvents() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => resolve(req.result.sort((a, b) => b.timestamp - a.timestamp))
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function getUnsyncedEvents() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const index = tx.objectStore(STORE_NAME).index('synced')
    const req = index.getAll(IDBKeyRange.only(false))
    req.onsuccess = () => resolve(req.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function markSynced(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)
    req.onsuccess = () => {
      const record = req.result
      if (record) {
        record.synced = true
        store.put(record)
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = (e) => reject(e.target.error)
  })
}

export async function deleteEvent(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = (e) => reject(e.target.error)
  })
}

export async function exportToCSV() {
  const events = await getAllEvents()
  if (!events.length) return ''
  const headers = Object.keys(events[0])
  const rows = events.map((e) =>
    headers.map((h) => JSON.stringify(e[h] ?? '')).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export async function exportToJSON() {
  const events = await getAllEvents()
  return JSON.stringify(events, null, 2)
}
