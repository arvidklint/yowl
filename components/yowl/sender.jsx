import { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { interpret } from 'xstate'

import SenderMachine, { S, T } from '../../machines/sender'

const loadingTexts = {
  [S.init]: 'Hello',
  [S.gettingUserMedia]: 'Not Connected',
  [S.connecting]: 'Connecting...',
  [S.calling]: 'Calling',
  [S.sending]: 'Sending',
  [S.noAnswer]: 'No Answer',
  [S.finished]: 'Done.',
  [S.failure]: 'Error',
}

export default class Sender extends Component {
  state = {
    current: null,
  }
  service = null

  constructor(props) {
    super(props)

    const machine = SenderMachine(props.peerID)
    this.state = {
      current: machine.initialState,
    }

    this.service = interpret(machine).onTransition((current) => {
      this.setState({ current })
    })
  }

  componentDidMount() {
    this.service.start()

    this.service.send(T.START)
  }

  componentWillUnmount() {
    this.service.stop()
  }

  render() {
    const { current } = this.state

    return (
      <div className="relative">
        <h1>{loadingTexts[current?.value] || ''}</h1>
        {current.matches(S.failure) && (
          <h2 className="text-red-400">{current.context.errorMessage}</h2>
        )}
        <h3 className="absolute top-0 right-0">{current.context.id}</h3>
      </div>
    )
  }
}
