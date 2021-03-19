/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date:   2017-06-13T14:27:34+02:00
 * @Copyright: Technology Studio
**/

import type { Store, Action, Unsubscribe } from 'redux'

class StoreManager {
  _store: Store | null
  _delayedSubscription: (() => void)[]

  constructor () {
    this._store = null
    this._delayedSubscription = []
  }

  _isStore = (): boolean => this._store != null

  _setStore (store: Store): void {
    this._store = store
    if (this._delayedSubscription.length) {
      this._delayedSubscription.forEach((handleChange: () => void) => {
        this._subscribe(handleChange)
      })
      this._delayedSubscription = []
    }
  }

  _getStore (): Store {
    if (this._store) {
      return this._store
    }
    throw Error('store is not set, initialize Store Manager in redux configure store')
  }

  /* TODO: refactor to support unsubscribe, we don't implemented due delayed subscriptions
    _subscribe (handleChange: () => void) {
    let unsubscribe = this._getStore().subscribe(handleChange)
    handleChange()
    return unsubscribe
  } */

  _subscribe (handleChange: () => void): Unsubscribe {
    const unsubscribe = this._getStore().subscribe(handleChange)
    handleChange()
    return unsubscribe
  }

  dispatch = <ACTION extends Action>(action: ACTION): ACTION => {
    return this._getStore().dispatch(action)
  }

  observeStore<REDUX_STATE> (onChange: (state: REDUX_STATE) => void): void {
    this.observeStoreWithSelect((state: REDUX_STATE) => state, onChange)
  }

  observeStoreWithSelect<REDUX_STATE, STATE> (select: (state: REDUX_STATE) => STATE, onChange: (state: STATE) => void): void {
    let currentState: STATE

    function _handleChange (): void {
      const nextState: STATE = select(storeManager._getStore().getState())
      if (nextState !== currentState) {
        currentState = nextState
        onChange(currentState)
      }
    }
    if (this._isStore()) {
      this._subscribe(_handleChange)
    } else {
      this._delayedSubscription.push(_handleChange)
    }
  }
}

export const storeManager: StoreManager = new StoreManager()
