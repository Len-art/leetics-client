export interface ClientSettings {
  prefix: string
}

export interface ClientArgs {
  [key: string]: string | number | undefined
}

export interface EventData {
  event: EventTypes
  value?: string
}

export enum EventTypes {
  alive = 1,
  click,
  navigation,
}
