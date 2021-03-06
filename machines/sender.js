import { v4 as uuidv4 } from 'uuid'

import { Machine, assign } from 'xstate'

import { getUserMedia, closeUserMedia } from '../utils/browser'

// States
export const S = {
  init: 'init',
  gettingUserMedia: 'gettingUserMedia',
  userMediaFailure: 'userMediaFailure',
  connecting: 'connecting',
  calling: 'calling',
  sending: 'sending',
  noAnswer: 'noAnswer',
  finished: 'finished',
  failure: 'failure',
}

// Transitions
export const T = {
  START: 'START',
}

function connect(id) {
  const Peer = require('peerjs').default
  return new Peer(id, {
    host: process.env.NEXT_PUBLIC_PEER_HOST,
    port: process.env.NEXT_PUBLIC_PEER_PORT,
    path: process.env.NEXT_PUBLIC_PEER_PATH,
  })
}

export default function SenderMachine(otherID) {
  return Machine(
    {
      initial: S.init,
      context: {
        stream: null,
        call: {},
        id: Math.floor(Math.random() * 100), // uuidv4(),
        peer: null,
        otherID,
        errorMessage: null,
      },
      states: {
        [S.init]: {
          on: {
            START: S.gettingUserMedia,
          },
        },
        [S.gettingUserMedia]: {
          invoke: {
            src: () => getUserMedia({ video: true, audio: false }),
            onDone: {
              target: S.connecting,
              actions: 'setStream',
            },
            onError: {
              target: S.failure,
              actions: 'userMediaError',
            },
          },
        },
        [S.userMediaFailure]: {
          actions: 'userMediaError',
        },
        [S.connecting]: {
          invoke: {
            src: (ctx) => (callback) => {
              callback({ type: 'CALL', peer: connect(ctx.id) })
            },
            onDone: { target: S.calling },
          },
          on: {
            CALL: {
              target: S.calling,
              actions: 'setPeer',
            },
          },
        },
        [S.calling]: {
          invoke: {
            src: (ctx) => {
              return (callback) => {
                if (!ctx.peer)
                  return callback({ type: 'ERROR', error: 'No peer' })
                if (!ctx.id) return callback({ type: 'ERROR', error: 'No Id' })
                if (!ctx.stream)
                  return callback({ type: 'ERROR', error: 'No stream' })

                const call = ctx.peer.call(ctx.otherID, ctx.stream)
                call.on('close', () => {
                  callback('CLOSE')
                })
                call.on('error', () => {
                  callback({ type: 'ERROR', message: 'Stream error' })
                })
                let callingTime = 0
                const checkOpen = () => {
                  if (callingTime > 5000) {
                    callback('NO_ANSWER')
                    return
                  }
                  if (call.open) {
                    callback('SEND')
                  } else {
                    setTimeout(() => {
                      callingTime += 100
                      checkOpen()
                    }, 100)
                  }
                }
                checkOpen()
              }
            },
          },
          on: {
            SEND: S.sending,
            CLOSE: {
              target: S.finished,
              actions: 'close',
            },
            ERROR: {
              target: S.error,
              actions: 'error',
            },
            NO_ANSWER: S.noAnswer,
          },
        },
        [S.sending]: {
          on: {
            CLOSE: S.closing,
          },
        },
        [S.noAnswer]: {},
        [S.finished]: {
          on: {
            START: S.gettingUserMedia,
          },
        },
        [S.failure]: {},
      },
    },
    {
      actions: {
        setStream: assign({
          stream: (_, { data = null }) => data,
        }),
        setPeer: assign({
          peer: (_, { peer = null }) => peer,
        }),
        error: (_, { message }) => {
          if (!message) return
          console.log('ERROR: ', message)
          return assign({
            errorMessage: message,
          })
        },
        userMediaError: assign({
          errorMessage: (_, event) => event.data.message,
        }),
        closeStream: ({ call, peer, stream }) => {
          call && call.close()
          peer && peer.destroy()
          stream && closeUserMedia(stream)
        },
      },
    }
  )
}
