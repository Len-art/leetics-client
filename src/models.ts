export interface ClientSettings {
  prefix: string
}

export interface Config {
  preventOnKill?: boolean
}

export interface ClientArgs {
  [key: string]: string | number | undefined
}

export interface EventData {
  event: EventTypes
  guestId?: string
  value?: string
}

export enum EventTypes {
  alive = 1,
  click,
  navigation,
  killed,
  guestIdentified,
}
