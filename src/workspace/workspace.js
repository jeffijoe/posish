// @flow
import { model } from 'libx'
import { toJS, reaction, observable } from 'mobx'
import * as fragmentUtil from '../utils/fragments'

const COLORS = ['#FF0000', '#00FF00', '#0000FF']

export interface Workspace {
  id: string;
  name: string;
  serialize (): Object;
  template: string;
  code: string;
  +output: string;
  fragments: Array<fragmentUtil.Fragment>
}

export default function createWorkspace (attrs: Object, opts?: Object): Workspace {
  const workspace = model({
    serialize () {
      return toJS(workspace)
    }
  }).extendObservable({
    name: 'Untitled',
    code: '',
    template: '',
    fragments: observable.ref([])
  })

  reaction(() => workspace.code, (code) => {
    workspace.set({
      fragments: fragmentUtil.codeUpdated(workspace.fragments, code)
    })
  })

  workspace.set(attrs, opts)
  return workspace
}
