// @flow
import * as React from 'react'
import Homepage from './homepage/components/Homepage'
import Workspace from './workspace/components/Workspace'
import { Provider, observer } from 'inferno-mobx'
import type { RootStore } from './root-store'
import { BodyClass } from './components/ClassName'
import { css } from 'emotion'
import type { View } from './stores/router-store'

export type Props = {
  rootStore: RootStore
}

const themeStyles = {
  light: css`
    background-color: #f2f4fa;
    color: #454552;
  `,
  dark: css`
    background-color: #2B313C;
    color: #fafaff;
  `
}

class App extends React.Component<Props> {
  renderCurrentView (view: ?View) {
    const rootStore = this.props.rootStore
    switch (view) {
      case rootStore.workspaceStore:
        return <Workspace workspaceStore={rootStore.workspaceStore} />
      default:
        return <Homepage />
    }
  }

  render () {
    const currentView = this.props.rootStore.routerStore.currentView
    return (
      <Provider rootStore={this.props.rootStore}>
        <BodyClass className={themeStyles[this.props.rootStore.themeStore.theme.id]}>
          {this.renderCurrentView(currentView)}
        </BodyClass>
      </Provider>
    )
  }
}

export default (observer(App): typeof App)
