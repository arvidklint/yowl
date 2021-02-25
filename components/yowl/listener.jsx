import { useEffect, useState } from 'react'
import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'

import { setupListener } from '../../peer'

import Video from './video'
import QR from './qr'

const S = {
  init: 'init',
  connecting: 'connecting',
  waiting: 'waiting',
  listening: 'listening',
  error: 'error',
}

const machine = Machine({
  initial: S.init,
  states: {
    [S.init]: {
      on: {
        START: S.connecting,
      },
    },
    [S.connecting]: {
      invoke: {
        src: 'connect',
        onDone: { target: S.waiting },
      },
    },
    [S.waiting]: {
      on: {
        LISTEN: S.listening,
      },
    },
    [S.listening]: {
      // TODO: Close
    },
    [S.error]: {},
  },
})

export default function Listener() {
  const [myID, setMyID] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)

  const addRemoteStream = (rs) => {
    setRemoteStream(rs)
    send('LISTEN')
  }

  const connect = async () => {
    setMyID(setupListener(addRemoteStream))
  }

  const [state, send] = useMachine(machine, {
    services: {
      connect,
    },
  })

  useEffect(() => {
    if (state.matches(S.init)) send('START')
  })

  return (
    <div className="p-4">
      {state.matches(S.waiting) && (
        <QR value={`http://localhost:3000/sender/${myID}`} />
      )}
      Remote stream
      {state.matches(S.listening) && <Video srcObject={remoteStream} />}
    </div>
  )
}
