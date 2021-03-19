/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date:   2017-06-14T21:19:38+02:00
 * @Copyright: Technology Studio
**/

import type { Action } from 'redux'

import { storeManager } from '../Api/StoreManager'

export class AbstractStateObservableManager<STATE, REDUX_STATE> {
  _state: STATE | null

  constructor (stateSelector: (state: REDUX_STATE) => STATE) {
    this._state = null
    storeManager.observeStoreWithSelect(stateSelector, this._onChangeHandler)
  }

  dispatchAction <ACTION extends Action>(action: ACTION): ACTION {
    return storeManager.dispatch(action)
  }

  _onChangeHandler = (state: STATE): void => {
    this.onChange(state)
  }

  onChange (state: STATE): void {
    this._state = state
  }

  getState (): STATE | null {
    return this._state
  }
}
