import * as React from 'react'
import { observer } from 'inferno-mobx'
import { withTheme } from '../../../utils/theming'
import { css } from 'emotion'
import MdClose from 'react-icons/lib/md/close'
import { shade } from 'polished'

const absolute = css`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`

export const Editor = withTheme(observer(({ readOnly, value, onChange, theme, ...rest }) => {
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
          font-size: 14px;
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
        {...rest}
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
    this.props.workspaceStore.selectionProvider.setContainerNode(node)
    // if (node) {
    //   document.addEventListener('selectionchange', this.onSelectionChange)
    // } else {
    //   document.removeEventListener('selectionchange', this.onSelectionChange)
    // }
  };

  onKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'm') {
      this.props.workspaceStore.highlight()
    }
  };

  renderFragment = (workspace, theme, fragment, depth = 1) => {
    const spanClass = css`
      position: relative;
      padding: 1px;
      line-height: 1.4em;
      border-radius: 4px;
      &:hover {
        & > a {
          opacity: 1;
        }
      }
    `
    const style = fragment.color && {
      backgroundColor: fragment.color,
      border: `1px solid ${shade(0.7, fragment.color)}`
    }

    let result = []
    if (!fragment.innerFragments || fragment.innerFragments.length === 0) {
      result = fragment.parts[0]
    } else {
      fragment.innerFragments.forEach((innerFrag, idx) => {
        if (idx === 0) {
          result.push(<span key={`${fragment.key}-part0`}>{fragment.parts[0]}</span>)
        }
        result.push(this.renderFragment(workspace, theme, innerFrag, depth + 1))
        result.push(<span key={`${fragment.key}-part${idx + 1}`}>{fragment.parts[idx + 1]}</span>)
      })
    }

    return (
      <span className={spanClass} key={fragment.key} style={style}>
        {result}
        {fragment.color &&
          <a
            onClick={e => e.preventDefault() || workspace.removeHighlight(fragment.key)}
            className={css`
              text-decoration: none;
              opacity: 0;
              position: absolute;
              top: -8px;
              left: -8px;
              width: 16px;
              height: 16px;
              cursor: pointer;
              background-color: ${theme.id === 'light' ? '#f0f0fe' : '#404049'};
              z-index: ${depth};
              border-radius: 50%;
              font-size: 10px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border: 1px solid ${theme.id === 'light' ? '#e0e0ee' : '#202039'};
              &:hover {
                opacity: 1!important;
              }
              `
            }
          >
            <MdClose/>
          </a>
        }
      </span>
    )
  };

  render () {
    const { workspace, theme } = this.props
    const frags = workspace.fragments
    return (
      <div className={css`user-select: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;`}>
        {frags.length === 0
          ? (
            <div
              className={css`
                padding: 10% 20px;
                overflow: auto;
                text-align: center;
                opacity: 0.7;
               `
              }
            >
              Once you have written some code, highlight points of interest
              here and press Ctrl+M to add an output.
            </div>
          )
          : (
            <div
              ref={this.setRef}
              onKeyPress={this.onKeyPress}
              tabIndex={-1}
              className={css`
                ${absolute};
                padding: 10px;
                font-family: 'courier new';
                font-size: 14px;
                white-space: pre;
                overflow: auto;
                user-select: text;
                outline: none;
                `
              }
            >
              {frags.map((f) =>
                this.renderFragment(workspace, theme, f)
              )}
            </div>
          )
        }
      </div>
    )
  }
}))
