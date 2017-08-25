// @flow
import type { Fragment } from './fragments'
import template from 'lodash/template'
import flatten from 'lodash/flatten'

export type Output = {
  color: string;
  content: string;
  text: string;
}

function collectFragments (fragments: Array<Fragment>): Array<Fragment> {
  const relevantFrags = fragments.map(
    f => {
      const result: Array<Fragment> = []
      if (f.color) {
        result.push(f)
      }
      if (f.innerFragments) {
        result.push(...collectFragments(f.innerFragments))
      }
      return result
    }
  )

  return flatten(relevantFrags).filter(x => x !== false)
}

export function generateOutputs (source: string, fragments: Array<Fragment>, templateString: string): Array<Output> {
  const compiled = template(templateString, {
    interpolate: /\{\{(.+?)\}\}/g
  })

  const relevantFrags = collectFragments(fragments)

  return relevantFrags.map(f => ({
    color: f.color || '',
    content: compiled({ POS_START: f.startPos, POS_END: f.endPos, LINE_START: 0, COL_START: 2, LINE_END: 0, COL_END: 4 }),
    text: f.text
  }))
}

function getNewlineCount (source: string, to: number): number {

}
