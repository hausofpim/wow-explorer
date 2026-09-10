import type { LocalizedString } from './LocalizedString'

export interface VehicleType {
  icons: VehicleTypeIcons
  sort_order: number
  localization: VehicleTypeLocalization
}

export interface VehicleTypeIcons {
  default: string
  elite: string
  premium: string
  special: string
  normal: string
}

export interface VehicleTypeLocalization {
  shortmark: LocalizedString
  mark: LocalizedString
}
