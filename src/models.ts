export interface ClientSettings {
  prefix: string
}

export interface ClientArgs {
  [key: string]: string | number | undefined
}

export enum EventTypes {
  alive = 1,
  click,
  navigation,
}
