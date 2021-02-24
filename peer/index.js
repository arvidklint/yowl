import { v4 as uuidv4 } from 'uuid'

import { isBrowser } from '../utils/browser'

let peer = null

export function setup(myStream, addRemoteStream) {
  if (!isBrowser()) return null

  const Peer = require('peerjs').default
  const id = uuidv4()
  peer = new Peer(id, {
    host: 'localhost',
    port: 9000,
    path: '/yowl',
  })

  peer.on('call', (call) => {
    call.answer(myStream) // Answer the call with an A/V stream.
    call.on('stream', (remoteStream) => {
      addRemoteStream(remoteStream)
    })
  })

  return id
}

export function getUserMedia({ video, audio }) {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video, audio })
      .then((stream) => {
        return resolve(stream)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export function call(id, stream) {
  return new Promise((resolve) => {
    if (!peer) return false
    if (!id || !stream) return false

    const call = peer.call(id, stream)
    call.on('stream', (remoteStream) => {
      return resolve(remoteStream)
    })
  })
}
