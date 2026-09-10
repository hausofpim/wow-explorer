import type { MappedShip } from '@/types/HeroShip'
import type { Nation } from '@/types/Nation'
import type { RawShip } from '@/types/Ship'
import { getLocalizedString } from '@/utils/getLocalizedString'
import { getImageUrl } from '@/utils/images'
import { mapRawShips, type MapRawShipsContext } from '@/utils/mapRawShip'

export type NationShowcase = {
  id: string
  name: string
  flag: string
  flagBg: string
  ships: MappedShip[]
}

const SHOWCASE_COUNT = 5

const pickDiverseShips = (ships: RawShip[], count = SHOWCASE_COUNT): RawShip[] => {
  const sorted = ships.slice().sort((a, b) => a.level - b.level)
  const picked: RawShip[] = []
  const usedTypes = new Set<string>()
  const usedLevels = new Set<number>()

  for (const ship of sorted) {
    if (picked.length >= count) break
    const type = ship.tags[0] ?? ''
    if (usedTypes.has(type) || usedLevels.has(ship.level)) continue
    picked.push(ship)
    usedTypes.add(type)
    usedLevels.add(ship.level)
  }

  for (const ship of sorted) {
    if (picked.length >= count) break
    if (picked.includes(ship)) continue
    picked.push(ship)
  }

  return picked
}

export const buildNationsShowcase = (
  ships: RawShip[],
  nations: Map<string, Nation>,
  ctx: MapRawShipsContext,
): NationShowcase[] => {
  const byNation = new Map<string, RawShip[]>()

  for (const ship of ships) {
    const list = byNation.get(ship.nation)
    if (list) list.push(ship)
    else byNation.set(ship.nation, [ship])
  }

  const result: NationShowcase[] = []

  for (const [id, nation] of nations) {
    const nationShips = byNation.get(id)
    if (!nationShips?.length) continue

    const flag = getImageUrl(nation.icons.large || nation.icons.default, ctx.mediaPath)

    result.push({
      id,
      name: getLocalizedString(nation.localization.mark, ctx.lang),
      flag,
      flagBg: flag,
      ships: mapRawShips(pickDiverseShips(nationShips), ctx),
    })
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
}
