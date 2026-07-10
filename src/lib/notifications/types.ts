export type AlertKind = 'opened' | 'resolved'

export type AlertContext = {
  monitor: { name: string; url: string }
  kind: AlertKind
  cause?: string | null
}
