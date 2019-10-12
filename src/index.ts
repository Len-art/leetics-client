import Client from './client'
import getContext from './context'
import { ClientSettings, EventTypes, EventData } from './models'

export default class LeeticsClient {
  public appId: number

  public visitId?: string

  private client: Client

  private idleTimer?: number

  private pingInterval = 6 * 1000

  private isFocused: boolean = document.hasFocus()

  private waitingEvents: EventData[] = []

  constructor(appId: number, clientSettings?: ClientSettings) {
    //TODO: unify this as a one config object
    this.appId = appId
    this.client = new Client(clientSettings)
    this.init()
  }

  private init = async () => {
    try {
      await this.sendVisit()

      this.setFocusListeners()
      this.startPing()
      this.sendIfWaiting()
    } catch (error) {}
  }

  /* this is what should be used by the user */
  public send = async (args: EventData) => {
    if (!this.visitId) {
      this.waitingEvents.push(args)
      return
    }
    try {
      await this.sendEvent(args)
    } catch (error) {
      console.error(error)
    }
  }

  private sendIfWaiting = async () => {
    try {
      this.waitingEvents.reduce(async (acc, args) => {
        await acc
        return this.send(args)
      }, Promise.resolve())
      this.waitingEvents = []
    } catch (error) {
      console.error(error)
    }
  }

  private sendVisit = async () => {
    const context = getContext()
    const data = await this.client.post<{ visitId: string }>(`visit/${this.appId}`, {
      guestId: 'this is guest id',
      ...context,
    })
    this.visitId = data.visitId
  }

  private setFocusListeners() {
    window.addEventListener('focus', () => this.handleIsFocused(true))
    window.addEventListener('blur', () => this.handleIsFocused(false))
  }

  private async handleIsFocused(isFocused: boolean) {
    this.isFocused = isFocused
    if (isFocused && !this.idleTimer) {
      await this.sendPing()
      this.startPing()
    }
  }

  private sendEvent = (args: { event: EventTypes; value?: string }) => {
    this.killPing()
    this.startPing()
    return this.client.post(`event/${this.visitId}`, args)
  }

  private killPing = () => {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = undefined
    }
  }

  private startPing = () => {
    this.idleTimer = window.setTimeout(async () => {
      try {
        if (!this.appId || !this.isFocused) {
          this.idleTimer = undefined
          return
        }
        await this.sendPing()
        this.startPing()
      } catch (error) {}
    }, this.pingInterval)
  }

  private sendPing = () => this.client.post(`event/${this.visitId}`, { event: EventTypes.alive })
}
