import type { LocalizedString } from './LocalizedString'

export interface Nation {
  name: string
  icons: NationIcons
  color: number
  tags: string[]
  localization: NationLocalization
  id: number
}

export interface NationIcons {
  large: string
  default: string
  local_large: string
  local_tiny: string
  small: string
  local_small: string
  tiny: string
}

export interface NationLocalization {
  mark: LocalizedString
}
