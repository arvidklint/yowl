import { useState, useEffect } from 'react'
import { Machine } from 'xstate'

import { useMachine } from '@xstate/react'

import { sendStream, getUserMedia, setupSender } from '../../peer'

const S = {
  init: 'init',
  gettingUserMedia: 'gettingUserMedia',
  connecting: 'connecting',
  calling: 'calling',
  sending: 'sending',
  error: 'error',
}

const machine = Machine({
  initial: S.init,
  states: {
    [S.init]: {
      on: {
        START: S.gettingUserMedia,
      },
    },
    [S.gettingUserMedia]: {
      invoke: {
        src: 'getStream',
        onDone: { target: S.connecting },
        onError: { target: S.error },
      },
    },
    [S.connecting]: {
      invoke: {
        src: 'connect',
        onDone: { target: S.calling },
      },
    },
    [S.calling]: {
      invoke: {
        src: 'call',
        onDone: { target: S.sending },
      },
    },
    [S.sending]: {
      // TODO: Close
    },
    [S.error]: {},
  },
})

export default function Sender({ peerID }) {
  const [myStream, setMyStream] = useState(null)

  const getStream = async () => {
    try {
      const s = await getUserMedia({ video: true, audio: false })
      setMyStream(s)
    } catch (e) {
      console.error(e)
    }
  }

  const connect = async () => {
    setupSender()
  }

  const call = async () => {
    await sendStream(peerID, myStream)
  }

  const [state, send] = useMachine(machine, {
    services: {
      getStream,
      connect,
      call,
    },
  })

  useEffect(() => {
    if (state.matches(S.init)) send('START')
  }, [])

  const loadingTexts = {
    [S.init]: 'Hello',
    [S.gettingUserMedia]: 'Not Connected',
    [S.connecting]: 'Connecting...',
    [S.calling]: 'Sending',
    [S.error]: 'Error',
  }

  return <h1>{loadingTexts[state.value] || ''}</h1>
}
