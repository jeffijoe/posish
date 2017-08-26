// @flow

export type Selection = {
  start: number;
  end: number;
}

export interface SelectionProvider {
  getSelection (): Selection;
  setContainerNode (node: Element): SelectionProvider;
}

/**
 * Creates a selection provider.
 */
export default function createOutputSelectionProvider (): SelectionProvider {
  let _node: ?Element = null
  const that: SelectionProvider = {
    /**
     * Sets the container node used to get the correct selection.
     */
    setContainerNode (node: Element) {
      _node = node
      return that
    },
    /**
     * Gets the current selection.
     */
    getSelection () {
      if (!_node) {
        return { start: 0, end: 0 }
      }
      return getSelectionPos(_node)
    }
  }

  return that
}

/**
 * Gets the correct selection based on a container element.
 */
function getSelectionPos (containerEl: Element): Selection {
  const sel = window.getSelection()
  if (sel.rangeCount === 0) {
    return { start: 0, end: 0 }
  }
  const range = sel.getRangeAt(0)
  const preSelectionRange = range.cloneRange()
  preSelectionRange.selectNodeContents(containerEl)
  preSelectionRange.setEnd(range.startContainer, range.startOffset)
  const start = preSelectionRange.toString().length
  const end = start + range.toString().length
  sel.removeAllRanges()
  return {
    start,
    end
  }
}
