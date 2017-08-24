// @flow
import { model } from 'libx'

export interface Workspace {
  id: string;
  name: string;
}

export default function createWorkspace (attrs: Object, opts?: Object): Workspace {
  return model().extendObservable({
    name: 'Untitled'
  }).set(attrs, opts)
}
