import React from 'react'
import withSideEffect from 'react-side-effect'
import uniq from 'lodash/uniq'

const reducePropsToState = (propsList) => (
  uniq(propsList.map((props) => props.className)).join(' ')
)

function makeClassNameRenderer (tag) {
  const handleStateChangeOnClient = (stringClassNames) => {
    document.getElementsByTagName(tag)[0].className = stringClassNames
  }

  class TagNameRenderer extends React.Component {
    static displayName = `${tag.toUpperCase()}ClassName`

    render () {
      if (this.props.children) {
        return React.Children.only(this.props.children)
      }

      return null
    }
  }

  return withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient
  )(TagNameRenderer)
}

export const BodyClass = makeClassNameRenderer('body')
export const HtmlClass = makeClassNameRenderer('html')
