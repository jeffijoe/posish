import * as React from 'react'
import { observer } from 'inferno-mobx'
import { withTheme } from '../../../utils/theming'
import { css } from 'emotion'

const absolute = css`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`

export const Editor = withTheme(observer(({ readOnly, value, onChange, theme }) => {
  return (
    <div>
      <textarea
        className={css`
          ${absolute};
          color: ${theme.textColor};
          display: block;
          outline: none;
          resize: none;
          padding: 10px;
          font-weight: 600;
          font-family: 'courier new';
          white-space: nowrap;
          &:focus {
            background-color: ${theme.id === 'light' ? '#fff' : '#404049'}
          }
        `}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  )
}))

function isChildOf (parent, child) {
  if (!parent) {
    return false
  }

  if (!child) {
    return false
  }

  let p = child.parentNode
  while (p) {
    if (p === parent) {
      return true
    }
    p = p.parentNode
  }
  return false
}

export const Highlighter = withTheme(observer(class Highlighter extends React.Component {
  onSelectionChange = e => {
    const selection = document.getSelection()
    console.log(selection)
    if (isChildOf(this._node, selection.anchorNode) && isChildOf(this._node, selection.focusNode)) {
      console.clear()
      console.log('yay', { baseOffset: selection.baseOffset, extentOffset: selection.extentOffset })
    }
  };

  setRef = (node) => {
    this._node = node
    if (node) {
      document.addEventListener('selectionchange', this.onSelectionChange)
    } else {
      document.removeEventListener('selectionchange', this.onSelectionChange)
    }
  };

  render () {
    const { workspace } = this.props
    const frags = workspace.fragments
    return (
      <div className={css`user-select: none;`}>
        <div
          ref={this.setRef}
          className={css`
            ${absolute};
            padding: 10px;
            font-family: 'courier new';
            white-space: pre;
            overflow: auto;
            user-select: text;
            `
          }
        >
          {frags.map((f) =>
            <span key={f.key}>{f.text}</span>
          )}
        </div>
      </div>
    )
  }
}))
