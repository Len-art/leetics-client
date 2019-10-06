import Client from './client'
import { ClientSettings } from './models'

export default class LeeticsClient {
  public appId: string

  private client: Client

  private idleTimer?: number

  private isFocused = false

  constructor(appId: string, settings?: Partial<ClientSettings>) {
    this.appId = appId
    this.client = new Client()
    this.init()
  }

  private init = async () => {
    try {
      const data = await this.client.post('/visit', { appId: this.appId })
      console.log(data)
    } catch (error) {}
  }

  handleFocused = () => {}
}
