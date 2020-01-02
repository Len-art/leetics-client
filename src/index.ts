import Client from './client'
import getContext from './context'
import { ClientSettings, EventTypes, EventData, Config } from './models'

// TODO: add debug mode with logging

export default class LeeticsClient {
  public appId: string

  public visitId?: string

  private config: Config = {
    preventOnKill: false,
  }

  private client: Client

  private idleTimer?: number

  private pingInterval = 60 * 1000

  private isFocused: boolean = false

  private waitingEvents: EventData[] = []

  constructor(appId: string, clientSettings?: ClientSettings) {
    if (typeof window !== 'undefined') {
      this.isFocused = document.hasFocus()
    }
    if (typeof appId !== 'string' || appId.length === 0) {
      throw new Error('App ID argument is required')
    }
    // TODO: unify this as a one config object
    this.appId = appId
    this.client = new Client(clientSettings)
    this.init()
  }

  private init = () => {
    this.sendVisit()
    this.setFocusListeners()
    this.setUpOnKill()
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

  private setUpOnKill = () => {
    if (!this.config.preventOnKill) {
      window.addEventListener('beforeunload', this.onKill)
    }
  }

  public onKill = () => {
    this.sendEvent({ event: EventTypes.killed })
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
    try {
      const context = getContext()
      const data = await this.client.post<{ visitId: string }>(`visit/${this.appId}`, {
        guestId: 'this is guest id',
        ...context,
      })
      this.visitId = data.visitId
      this.startPing()
      this.sendIfWaiting()
    } catch (error) {
      console.error(error)
    }
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
        if (!this.isFocused) {
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
