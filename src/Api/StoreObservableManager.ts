/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date:   2017-06-14T21:19:38+02:00
 * @Copyright: Technology Studio
**/

import { AbstractStateObservableManager } from './AbstractStateObservableManager'

export class StoreObservableManager<STATE> extends AbstractStateObservableManager<STATE, STATE> {
  constructor () {
    super((state) => state)
  }
}
