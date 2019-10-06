import { ClientSettings, ClientArgs } from './models'

export default class {
  private defaults: ClientSettings = {
    url: 'https://len-art.tech/api',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  }

  constructor(settings?: Partial<ClientSettings>) {
    this.defaults = { ...this.defaults, ...settings }
  }

  private call = async (path: string, method: 'GET' | 'POST', args: ClientArgs) =>
    new Promise(async (res, rej) => {
      try {
        const { url, headers } = this.defaults
        const response = await fetch(`${url}/${path}`, {
          method,
          headers,
          body: JSON.stringify(args),
        })

        const contentLength = response.headers.get('Content-Length')
        if (!contentLength) {
          res()
        }

        if (response.ok) {
          res(await response.json())
        } else {
          const { message } = await response.json()
          throw new Error(message)
        }
      } catch (error) {
        console.log(error)
        rej(error)
      }
    })

  public post = (path: string, args: ClientArgs) => this.call(path, 'POST', args)

  public get = (path: string, args: ClientArgs) => this.call(path, 'GET', args)
}
