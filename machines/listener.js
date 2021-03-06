import { Machine, assign } from 'xstate'
import { v4 as uuidv4 } from 'uuid'
import { isBrowser, closeUserMedia } from '../utils/browser'

if (isBrowser) {
  const Peer = require('peerjs').default
}

// States
export const S = {
  init: 'init',
  connecting: 'connecting',
  waiting: 'waiting', // waiting for call from sender
  listening: 'listening', // listening to sender
  failure: 'failure',
}

// Transitions
export const T = {
  CLOSE: 'CLOSE',
  START: 'START',
}

export default function ListenerMachine() {
  return Machine(
    {
      initial: S.init,
      context: {
        call: null,
        id: Math.floor(Math.random() * 100), // uuidv4(),
        peer: null,
        stream: null,
      },
      states: {
        [S.init]: {
          on: {
            START: S.connecting,
          },
        },
        [S.connecting]: {
          invoke: {
            src: (ctx) => (callback) => {
              const peer = new Peer(ctx.id, {
                host: process.env.NEXT_PUBLIC_PEER_HOST,
                port: process.env.NEXT_PUBLIC_PEER_PORT,
                path: process.env.NEXT_PUBLIC_PEER_PATH,
              })

              callback({ type: 'WAIT', peer })
            },
            onDone: { target: S.calling },
          },
          on: {
            WAIT: {
              target: S.waiting,
              actions: 'setPeer',
            },
          },
        },
        [S.waiting]: {
          invoke: {
            src: (ctx) => (callback) => {
              ctx.peer.on('call', (call) => {
                call.answer()
                call.on('stream', (remoteStream) => {
                  callback({ type: 'LISTEN', remoteStream })
                })
                call.on('close', () => {
                  callback('CLOSE')
                })
                call.on('error', (error) => {
                  callback({ target: 'ERROR', message: 'Call error', error })
                })
              })
            },
          },
          on: {
            LISTEN: {
              target: S.listening,
              actions: 'setStream',
            },
            CLOSE: {
              target: S.waiting,
              actions: 'close',
            },
            ERROR: {
              target: S.failure,
              actions: 'error',
            },
          },
        },
        [S.listening]: {
          on: {
            CLOSE: {
              target: S.waiting,
              actions: 'close',
            },
          },
        },
        [S.failure]: {},
      },
    },
    {
      actions: {
        error: (_, { error, message }) => {
          if (!message) return
          console.log('ERROR: ', error || message)
          return assign({
            errorMessage: message,
          })
        },
        setStream: assign({
          stream: (_, { remoteStream }) => remoteStream,
        }),
        setPeer: assign({
          peer: (_, { peer = null }) => peer,
        }),
        close: ({ call, stream }) => {
          call && call.close()
          stream && closeUserMedia(stream)

          return assign({
            call: null,
            stream: null,
          })
        },
      },
    }
  )
}
