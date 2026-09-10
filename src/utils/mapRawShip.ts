import type { MappedShip } from '@/types/HeroShip'
import type { Nation } from '@/types/Nation'
import type { RawShip } from '@/types/Ship'
import type { VehicleType } from '@/types/VehicleType'
import { getLocalizedString } from './getLocalizedString'
import { getImageUrl } from './images'

export type MapRawShipsContext = {
  mediaPath: string
  lang: string
  nations: Map<string, Nation>
  vehicleTypes: Map<string, VehicleType>
}

export const mapRawShips = (ships: RawShip[], ctx: MapRawShipsContext): MappedShip[] => {
  const { mediaPath, lang, nations, vehicleTypes } = ctx

  return ships.map((ship) => {
    const typeKey = ship.tags[0] ?? ''
    const vehicleType = vehicleTypes.get(typeKey)
    const nation = nations.get(ship.nation)

    return {
      id: ship.name,
      name: getLocalizedString(ship.localization.mark, lang),
      description: getLocalizedString(ship.localization.description, lang),
      image: getImageUrl(ship.icons.large, mediaPath),
      level: ship.level,
      type: getLocalizedString(vehicleType?.localization.mark, lang),
      typeKey,
      typeImage: getImageUrl(vehicleType?.icons.default || '', mediaPath),
      contourImage: getImageUrl(ship.icons.contour_alive, mediaPath),
      nation: getLocalizedString(nation?.localization.mark, lang),
      nationKey: ship.nation,
      nationImage: getImageUrl(nation?.icons.default || '', mediaPath),
    }
  })
}
