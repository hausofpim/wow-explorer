import type { MappedShip } from '@/types/HeroShip'
import type { ShipsFilter } from '@/types/ShipsFilter'

export const applyShipFilters = (ships: MappedShip[], filters: ShipsFilter): MappedShip[] => {
  const nameQuery = filters.name?.trim().toLowerCase() ?? ''
  const typeFilter = filters.type ?? ''
  const nationFilter = filters.nation ?? ''
  const levelFilter = filters.level ?? ''

  if (!nameQuery && !typeFilter && !nationFilter && !levelFilter) {
    return ships
  }

  const levelValue = levelFilter ? Number(levelFilter) : null
  const result: MappedShip[] = []

  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i]!

    if (nameQuery && !ship.name.toLowerCase().includes(nameQuery)) continue
    if (typeFilter && ship.typeKey !== typeFilter) continue
    if (nationFilter && ship.nationKey !== nationFilter) continue
    if (levelValue !== null && ship.level !== levelValue) continue

    result.push(ship)
  }

  return result
}
