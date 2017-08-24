// @flow
import { model } from 'libx'
import { toJS, reaction, observable } from 'mobx'
import uniqueId from 'lodash/uniqueId'

const COLORS = ['#FF0000', '#00FF00', '#0000FF']

type Fragment = {
  key: string;
  startPos: number;
  endPos: number;
  text: string;
  color: ?string;
}

export interface Workspace {
  id: string;
  name: string;
  serialize (): Object;
  template: string;
  code: string;
  +output: string;
  fragments: Array<Fragment>
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
      fragments: codeUpdated(workspace.fragments, code)
    })
  })

  workspace.set(attrs, opts)
  return workspace
}

function newFrag (startPos: number, endPos: number, text: string): Fragment {
  return {
    key: uniqueId('frag-'),
    startPos,
    endPos,
    text
  }
}

function codeUpdated (fragments: Array<Fragment>, code: string) {
  if (fragments.length === 0) {
    return [newFrag(0, code.length, code)]
  }
}
