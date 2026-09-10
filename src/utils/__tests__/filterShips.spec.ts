import { describe, expect, it } from 'vitest'
import { applyShipFilters } from '@/utils/filterShips'
import type { MappedShip } from '@/types/HeroShip'

const ships: MappedShip[] = [
  {
    id: 'PGSD106',
    name: 'Yamato',
    description: '',
    image: '',
    level: 10,
    type: 'Battleship',
    typeKey: 'battleship',
    typeImage: '',
    contourImage: '',
    nation: 'Japan',
    nationKey: 'japan',
    nationImage: '',
  },
  {
    id: 'PRSC110',
    name: 'Gearing',
    description: '',
    image: '',
    level: 10,
    type: 'Destroyer',
    typeKey: 'destroyer',
    typeImage: '',
    contourImage: '',
    nation: 'USA',
    nationKey: 'usa',
    nationImage: '',
  },
  {
    id: 'PASC204',
    name: 'Atlanta',
    description: '',
    image: '',
    level: 7,
    type: 'Cruiser',
    typeKey: 'cruiser',
    typeImage: '',
    contourImage: '',
    nation: 'USA',
    nationKey: 'usa',
    nationImage: '',
  },
]

describe('applyShipFilters', () => {
  it('returns all ships when filters are empty', () => {
    expect(applyShipFilters(ships, { name: '', type: '', nation: '', level: '' })).toEqual(ships)
  })

  it('filters by name case-insensitively', () => {
    expect(applyShipFilters(ships, { name: 'yam', type: '', nation: '', level: '' })).toEqual([
      ships[0],
    ])
  })

  it('combines nation and level filters', () => {
    expect(
      applyShipFilters(ships, { name: '', type: '', nation: 'usa', level: '10' }).map((s) => s.id),
    ).toEqual(['PRSC110'])
  })
})
