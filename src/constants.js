export const BEACHES = [
  'Xcacel',
  'Xcacelito',
  'Chemuyil',
  'Xel-Há',
  'Tankah',
  'Tulum Norte',
  'Tulum Sur',
  'Punta Piedra',
  'Punta Brava',
  'Chen Río',
  'Punta Morena',
  'El Cardonal',
  'Otra (especificar)',
]

export const SPECIES = [
  { code: 'Cm', label: 'Cm', common: 'Carey verde' },
  { code: 'Cc', label: 'Cc', common: 'Caguama' },
  { code: 'Dc', label: 'Dc', common: 'Laúd' },
  { code: 'Ei', label: 'Ei', common: 'Carey' },
  { code: 'NK', label: 'NK', common: 'No identificada' },
]

export const EVENT_TYPES = [
  { code: 'nesting_success', label: 'Anidación exitosa' },
  { code: 'false_crawl', label: 'Rastro falso' },
  { code: 'emergence', label: 'Emergencia' },
  { code: 'nest_relocation', label: 'Relocalización' },
  { code: 'stranding', label: 'Varamientos' },
  { code: 'other', label: 'Otro' },
]

export const NEST_ZONES = [
  'Supralitoral alto',
  'Supralitoral bajo',
  'Litoral',
  'Vegetación',
]

export const SYNC_ENDPOINT =
  import.meta.env.VITE_SYNC_URL || 'https://track-classifier.onrender.com/api/events'
