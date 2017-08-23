// @flow
import * as React from 'react'
import { linkEvent } from 'inferno'
import { connect } from 'inferno-mobx'
import type { RootStore } from '../../root-store'

export type Props = {
  rootStore?: RootStore;
  to?: string;
  onClick?: Function;
}

function handleClick (props: Props, event: Event): mixed {
  if (props.onClick) {
    return props.onClick(event)
  }
  const rootStore = props.rootStore
  const to = props.to
  if (to && rootStore) {
    event.preventDefault()
    rootStore.routerStore.navigate(to)
  }
}

const Link = ({ onClick, ...props }: Props) =>
  React.createElement(
    'a',
    {
      href: props.to,
      ...props,
      onClick: linkEvent(props, handleClick)
    }
  )

export default connect(['rootStore'])(Link)
