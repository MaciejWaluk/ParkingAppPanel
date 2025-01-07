import { unitOfTime } from './types'

export const unitOfTimesArray: unitOfTime[] = ['hourly', 'daily', 'monthly']

export const tags: { value: string; label: string }[] = [
  { value: '24h', label: '24/7' },
  { value: 'concierge', label: 'Consierge' },
  { value: 'roofed', label: 'Zadaszony' },
  { value: 'underground', label: 'Podziemny' },
  { value: 'monitored', label: 'Monitorowany' },
  { value: 'guarded', label: 'Strzeżony' },
  { value: 'private', label: 'Prywatny' },
  { value: 'public', label: 'Publiczny' },
]

export const tagsObject = {
  '24h': '24/7',
  concierge: 'Consierge',
  roofed: 'Zadaszony',
  underground: 'Podziemny',
  monitored: 'Monitorowany',
  guarded: 'Strzeżony',
  private: 'Prywatny',
  public: 'Publiczny',
}

export const typeMap = {
  hourly: 'Godziny',
  daily: 'Dni',
  monthly: 'Miesiące',
}

export const spotTypes = {
  regular: 'Zwykłe',
  bigger: 'Powiększone',
  disabled: 'Dla niepełnosprawnych',
}
