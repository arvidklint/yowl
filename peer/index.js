import { v4 as uuidv4 } from 'uuid'

import { isBrowser } from '../utils/browser'

let peer = null
let id = null

function setup() {
  const Peer = require('peerjs').default
  id = uuidv4()
  return new Peer(id, {
    host: 'localhost',
    port: 9000,
    path: '/yowl',
  })
}

export function setupListener(addRemoteStream) {
  if (!isBrowser()) return null
  if (peer) return id

  peer = setup()

  peer.on('call', (call) => {
    call.answer()
    call.on('stream', (remoteStream) => {
      addRemoteStream(remoteStream)
    })
    call.on('close', () => {
      console.log('call closed')
    })
    call.on('error', (error) => {
      console.log('some error ', error)
    })
  })

  return id
}

export function setupSender() {
  peer = setup()

  return id
}

let myStream = null

export function getUserMedia({ video, audio }) {
  return new Promise((resolve, reject) => {
    if (myStream) return resolve(myStream)
    navigator.mediaDevices
      .getUserMedia({ video, audio })
      .then((stream) => {
        myStream = stream
        return resolve(stream)
      })
      .catch((err) => {
        myStream = stream
        return reject(err)
      })
  })
}

export function sendStream(id, stream) {
  return new Promise((resolve, reject) => {
    if (!peer) return reject('no peer')
    if (!id || !stream) return reject('no id or stream')

    const call = peer.call(id, stream)
    call.on('stream', () => {
      return resolve(true)
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
