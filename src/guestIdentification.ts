import shortid from 'shortid'

import Root from '.'
import { EventTypes } from './models'

export default class {
  private userIdKey = 'leetics-userId'

  public guestId?: string

  public hasGivenConsent = false

  private root: Root

  constructor(root: Root) {
    this.root = root
    this.checkIfKnownUser()
  }

  private checkIfKnownUser = async () => {
    try {
      const id = localStorage.getItem(this.userIdKey)
      if (id) {
        this.guestId = id
      }
    } catch (error) {
      /* silently fail */
    }
  }

  public onCookieConsent = () => {
    try {
      this.hasGivenConsent = true
      const id = shortid.generate()
      localStorage.setItem(this.userIdKey, id)
      this.guestId = id
      this.root.send({ event: EventTypes.guestIdentified, guestId: id })
    } catch (error) {
      /* silently fail */
    }
  }
}
