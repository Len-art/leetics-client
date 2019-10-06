export interface ClientSettings {
  url: string
  headers: {
    Accept: string
    'Content-Type': string
  }
}

export interface ClientArgs {
  [key: string]: string
}
