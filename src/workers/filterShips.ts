import type { MappedShip } from '@/types/HeroShip'
import type { FilterWorkerInbound, FilterWorkerOutbound } from '@/types/FilterWorker'
import { applyShipFilters } from '@/utils/filterShips'

const workerCtx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope

let cachedShips: MappedShip[] = []

workerCtx.onmessage = (event: MessageEvent<FilterWorkerInbound>) => {
  const message = event.data

  if (message.type === 'init') {
    cachedShips = message.ships
    workerCtx.postMessage({ type: 'ready', ships: cachedShips } satisfies FilterWorkerOutbound)
    return
  }

  if (message.type === 'filter') {
    workerCtx.postMessage({
      type: 'result',
      ships: applyShipFilters(cachedShips, message.filters),
      requestId: message.requestId,
    } satisfies FilterWorkerOutbound)
  }
}
