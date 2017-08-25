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

  return relevantFrags.map(f => {
    const [startLineCol, endLineCol] = getLineColInfo(source, f.startPos, f.endPos)
    return {
      color: f.color || '',
      content: compiled({
        POS_START: f.startPos,
        POS_END: f.endPos,
        LINE_START: startLineCol.line,
        COL_START: startLineCol.col,
        LINE_END: endLineCol.line,
        COL_END: endLineCol.col
      }),
      text: f.text
    }
  })
}

type LineCol = { line: number, col: number }

function getLineColInfo (source: string, start: number, end: number): [LineCol, LineCol] {
  let line = 0;
  let col = 0
  let i = 0
  let startLineCol = { line: 0, col: 0 }
  let endLineCol = { line: 0, col: 0 }
  while (i < end) {
    let ch = source.charCodeAt(i)
    if (i === start) {
      startLineCol = { line, col }
    }
    col++
    if (ch === 10) {
      line++
      col = 0
    }
    i++
  }
  endLineCol = { line, col }
  return [startLineCol, endLineCol]
}
