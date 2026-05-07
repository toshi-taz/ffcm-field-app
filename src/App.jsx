import { useState, useEffect } from 'react'
import HomeView from './views/HomeView.jsx'
import NewEventView from './views/NewEventView.jsx'
import RecordsView from './views/RecordsView.jsx'
import { setupOnlineListener } from './sync.js'

export default function App() {
  const [view, setView] = useState('home')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const cleanup = setupOnlineListener((result) => {
      if (result.synced > 0) {
        setToast(`${result.synced} registro(s) sincronizado(s)`)
        setTimeout(() => setToast(null), 3000)
      }
    })

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      cleanup()
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>FFCM Field App</h1>
        <span className={`online-dot ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'En línea' : 'Sin conexión'} />
      </header>

      {view === 'home' && <HomeView onNavigate={setView} />}
      {view === 'new' && <NewEventView onNavigate={setView} />}
      {view === 'records' && <RecordsView onNavigate={setView} />}

      {toast && <div className="sync-toast">{toast}</div>}
    </div>
  )
}
