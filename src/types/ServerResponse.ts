export interface ServerResponse<T> {
  status: 'ok' | 'error'
  data: T
  error?: string
}
