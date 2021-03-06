import { Component } from 'react'
import { interpret } from 'xstate'

import ListenerMachine, { S, T } from '../../machines/listener'

import QR from './qr'
import Button from '../common/button'
import Video from '../yowl/video'

export default class Listener extends Component {
  state = {
    current: null,
  }
  service = null

  constructor(props) {
    super(props)

    const machine = ListenerMachine()
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
    const { send } = this.service

    return (
      <div className="p-4">
        <div>{current.value}</div>
        {current.matches(S.waiting) && (
          <QR
            value={`${window.location.origin}/sender/${current.context.id}`}
          />
        )}
        Remote stream
        {current.matches(S.listening) && (
          <>
            <Video srcObject={current.context.stream} />
            <Button
              onClick={() => {
                console.log('click close')
                send(T.CLOSE)
              }}
            >
              Close
            </Button>
          </>
        )}
      </div>
    )
  }
}
