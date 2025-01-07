// src/data/locations.ts

export interface Location {
  id: number
  position: [number, number]
  name: string
  description?: string
}

export const locations: Location[] = [
  {
    id: 1,
    position: [53.1325, 23.1688],
    name: 'Rynek Kościuszki',
    description: 'Centralny plac miasta Białegostoku.',
  },
  {
    id: 2,
    position: [53.14, 23.164],
    name: 'Pałac Branickich',
    description: 'Zabytkowy pałac znany również jako "Wersalka Podlaska".',
  },
  {
    id: 3,
    position: [53.125, 23.1695],
    name: 'Białystok University of Technology',
    description: 'Jedna z wiodących uczelni technicznych w Polsce.',
  },
]
