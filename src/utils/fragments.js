// @flow

/**
 * This module contains the guts of the app, the functions for generating
 * fragments for highlighting.
 *
 * All functions are pure, with the exception of `newFrag` which generates a new random ID every time.
 */

import { v1 } from 'uuid'

/**
 * Fragment of text.
 */
export type Fragment = {
  /**
   * Unique ID.
   */
  key: string;
  /**
   * Starting position.
   */
  startPos: number;
  /**
   * End position.
   */
  endPos: number;
  /**
   * The text contained within the fragment.
   */
  text: string;
  /**
   * Parts surrounding inner fragments.
   */
  parts: Array<string>;
  /**
   * Color used for highlighting.
   */
  color: ?string;
  /**
   * Inner fragments.
   */
  innerFragments: ?Array<Fragment>;
}

/**
 * Creates a new fragment.
 */
export function newFrag (startPos: number, endPos: number, text: string, color?: ?string): Fragment {
  return {
    key: 'frag-' + v1(),
    startPos,
    endPos,
    text: text,
    parts: [text],
    color: color || null,
    innerFragments: null
  }
}

/**
 * Updates the fragments based on a new source.
 */
export function codeUpdated (fragments: Array<Fragment>, newSource: string): Array<Fragment> {
  return addFragment([], newSource, 0, newSource.length, null)
}

/**
 * Adds a highlight fragment at the specified position.
 */
export function highlight (
  fragments: Array<Fragment>,
  source: string,
  startPos: number,
  endPos: number,
  color: string
): Array<Fragment> {
  const parent = findFragment(fragments, startPos, endPos)
  if (parent) {
    if (parent.startPos === startPos && parent.endPos === endPos) {
      if (parent.color) {
        return fragments
      }

      return updateFragment(fragments, parent.key, {
        ...parent,
        color
      })
    }
    const innerFragments = addFragment(parent.innerFragments, source, startPos, endPos, color)
    if (innerFragments === parent.innerFragments) {
      return fragments
    }
    const updated = {
      ...parent,
      innerFragments,
      parts: updateParts(innerFragments, source, parent.startPos, parent.endPos)
    }

    return updateFragment(fragments, updated.key, updated)
  }

  return addFragment(fragments, source, startPos, endPos, color)
}

/**
 * Removes the fragment at the specified position.
 */
export function remove (fragments: Array<Fragment>, source: string, key: string): Array<Fragment> {
  const index = fragments.findIndex(f => f.key === key)
  if (index > -1) {
    return fragments.filter(f => f.key !== key)
  }

  return fragments.map(f => {
    let innerFragments = f.innerFragments
    if (!innerFragments) {
      return f
    }
    const index = innerFragments.findIndex(j => j.key === key)
    if (index > -1) {
      innerFragments = innerFragments.filter(x => x.key !== key)
      const parts = updateParts(innerFragments, source, f.startPos, f.endPos)
      return {
        ...f,
        innerFragments,
        parts
      }
    }
    return {
      ...f,
      innerFragments: remove(innerFragments, source, key)
    }
  })
}

/**
 * Calculates the new `parts` for a fragment based on inner fragments.
 */
function updateParts (
  innerFragments: Array<Fragment>,
  source: string,
  parentStartPos: number,
  parentEndPos: number
): Array<string> {
  if (innerFragments.length === 0) {
    return [source.substring(parentStartPos, parentEndPos)]
  }
  const first = innerFragments[0]
  const parts = [source.substring(parentStartPos, first.startPos)]
  for (let i = 0; i < innerFragments.length; i++) {
    const f = innerFragments[i]
    if (i === innerFragments.length - 1) {
      parts.push(source.substring(f.endPos, parentEndPos))
      break
    }
    const next = innerFragments[i + 1]
    parts.push(source.substring(f.endPos, next.startPos))
  }

  return parts
}

/**
 * Finds a fragment based on start and end position.
 */
function findFragment (fragments: ?Array<Fragment>, startPos: number, endPos: number): ?Fragment {
  if (!fragments) {
    return null
  }

  if (fragments.length === 0) {
    return null
  }

  const frag = fragments.find(x => x.startPos <= startPos && x.endPos >= endPos)
  if (!frag) {
    return null
  }

  // Check for inner fragments
  const inner = findFragment(frag.innerFragments, startPos, endPos)
  if (inner) {
    return inner
  }

  return frag
}

/**
 * Adds a new fragment.
 */
function addFragment (
  fragments: ?Array<Fragment>,
  source: string,
  startPos: number,
  endPos: number,
  color: ?string
): Array<Fragment> {
  if (!source) {
    return []
  }
  const text = source.substring(startPos, endPos)
  const frag = newFrag(startPos, endPos, text, color)
  if (!fragments) {
    return [frag]
  }

  const outOfBounds = fragments.some(f => {
    const lower = startPos < f.startPos && endPos > f.startPos && endPos < f.endPos
    const higher = startPos > f.startPos && startPos < f.endPos && endPos > f.endPos
    return lower || higher
  })

  if (outOfBounds) {
    return fragments
  }

  const within = fragments.filter(f => f.startPos >= startPos && f.endPos <= endPos)
  if (within.length > 0) {
    const withinStartIndex = fragments.indexOf(within[0])
    let withinEndIndex = withinStartIndex
    if (within.length > 1) {
      withinEndIndex = fragments.indexOf(within[within.length - 1])
    }
    fragments = fragments.filter((_, i) => i >= withinStartIndex || i < withinEndIndex)
    fragments.splice(withinStartIndex, withinEndIndex - withinStartIndex + 1, frag)
    frag.innerFragments = within
    frag.parts = updateParts(within, source, frag.startPos, frag.endPos)
    return fragments
  }

  // Figure out where to add the new fragment.
  const candidates = fragments.filter(x => x.endPos <= startPos)
  const last = Math.max(candidates.length, 0)
  const copy = fragments.slice()
  copy.splice(last, 0, frag)
  return copy
}

/**
 * Updates a fragment.
 */
function updateFragment (fragments: Array<Fragment>, key: string, updated: Fragment): Array<Fragment> {
  const idx = fragments.findIndex(f => f.key === key)
  if (idx > -1) {
    return fragments.map((f, i) => idx === i ? updated : f)
  }

  return fragments.map(f => {
    if (f.innerFragments) {
      return {
        ...f,
        innerFragments: updateFragment(f.innerFragments, key, updated)
      }
    }
    return f
  })
}
