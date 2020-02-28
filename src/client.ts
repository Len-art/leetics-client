import { ClientSettings, ClientArgs } from './models'

export default class {
  private prefix = 'https://len-art.tech/api'
  private defaults: RequestInit = {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  }

  constructor(settings?: ClientSettings) {
    if (settings) {
      this.prefix = settings.prefix
    }
  }

  private call = async <R>(path: string, method: 'GET' | 'POST', args?: ClientArgs): Promise<R> =>
    new Promise(async (res, rej) => {
      try {
        const request = await new Request(`${this.prefix}/${path}`, {
          method,
          ...this.defaults,
          body: JSON.stringify(args),
        })
        const response = await fetch(request)

        const contentLength = response.headers.get('Content-Length')
        if (!contentLength) {
          res()
        }
        if (response.ok) {
          const text = await response.text()
          if (text.length) {
            res(await JSON.parse(text))
          } else res()
        } else {
          const { message } = await response.json()
          throw new Error(message)
        }
      } catch (error) {
        console.error(error)
        rej(error)
      }
    })

  public post = <R>(path: string, args?: ClientArgs): Promise<R> => this.call<R>(path, 'POST', args)

  public get = <R>(path: string, args?: ClientArgs): Promise<R> => this.call(path, 'GET', args)
}
