import type { MappedShip } from '@/types/HeroShip'
import type { ShipsFilter } from '@/types/ShipsFilter'

export type FilterWorkerInbound =
  | { type: 'init'; ships: MappedShip[] }
  | { type: 'filter'; filters: ShipsFilter; requestId: number }

export type FilterWorkerOutbound =
  | { type: 'ready'; ships: MappedShip[] }
  | { type: 'result'; ships: MappedShip[]; requestId: number }
