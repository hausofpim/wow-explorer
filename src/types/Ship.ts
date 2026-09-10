import type { LocalizedString } from './LocalizedString'

export interface RawShip {
  level: number
  name: string
  icons: RawShipIcons
  tags: string[]
  localization: RawShipLocalization
  nation: string
}

export interface RawShipIcons {
  local_contour: string
  contour_alive: string
  medium: string
  default: string
  local_small: string
  contour_dead: string
  large: string
  local_contour_dead: string
  local_contour_alive: string
  small: string
  contour: string
}

export interface RawShipLocalization {
  shortmark: LocalizedString
  description: LocalizedString
  mark: LocalizedString
}
