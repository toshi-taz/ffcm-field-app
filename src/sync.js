import { getUnsyncedEvents, markSynced } from './db.js'
import { SYNC_ENDPOINT } from './constants.js'

export async function syncPendingEvents() {
  const pending = await getUnsyncedEvents()
  let synced = 0
  let failed = 0

  for (const event of pending) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)
      const res = await fetch(SYNC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (res.ok) {
        await markSynced(event.id)
        synced++
      } else {
        failed++
      }
    } catch {
      failed++
    }
  }

  return { synced, failed, total: pending.length }
}

export function setupOnlineListener(callback) {
  const handler = async () => {
    const result = await syncPendingEvents()
    callback(result)
  }
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}
