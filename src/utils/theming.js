import { connect, observer } from 'inferno-mobx'
import * as Inferno from 'inferno-compat'
import flow from 'lodash/flow'

export const withTheme = flow(
  (Target) => (props) => Inferno.createElement(Target, { ...props, theme: props.rootStore.themeStore.theme }),
  connect(['rootStore']),
  observer
)
