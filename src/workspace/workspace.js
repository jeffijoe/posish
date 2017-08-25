// @flow
import { model } from 'libx'
import { toJS, reaction, computed, observable } from 'mobx'
import * as fragmentUtil from '../utils/fragments'
import * as templateUtil from '../utils/template'
import type { Output } from '../utils/template'

const COLORS = [
  '#58C9B9',
  '#30A9DE',
  '#D1B6E1',
  '#C5E99B',
  '#E57373',
  '#F06292',
  '#BA68C8',
  '#9575CD',
  '#7986CB',
  '#64B5F6',
  '#B388FF',
  '#4FC3F7',
  '#4DD0E1',
  '#4DB6AC',
  '#81C784',
  '#AED581',
  '#DCE775'
]
let _colorIdx = 0

const nextColor = () => {
  const color = COLORS[_colorIdx]
  _colorIdx = _colorIdx === COLORS.length - 1 ? 0 : _colorIdx + 1
  return color
}

export interface Workspace {
  id: string;
  name: string;
  serialize (): Object;
  template: string;
  code: string;
  +output: Array<Output>;
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
    fragments: observable.ref([]),
    output: computed(() => {
      return templateUtil.generateOutputs(workspace.code, workspace.fragments, workspace.template)
    })
  }).withActions({
    highlight (startPos: number, endPos: number) {
      workspace.fragments = fragmentUtil.highlight(workspace.fragments, this.code, startPos, endPos, nextColor())
    },
    removeHighlight (key: string) {
      workspace.fragments = fragmentUtil.remove(workspace.fragments, workspace.code, key)
    }
  })

  reaction(() => workspace.code, (code) => {
    workspace.set({
      fragments: fragmentUtil.codeUpdated(workspace.fragments, code)
    })
  })

  workspace.set(attrs, opts)
  return workspace
}
