const express = require('express')
const { ExpressPeerServer } = require('peer')

const app = express()

app.get('/', (_, res) => res.send('Hello world!'))

const server = app.listen(3001)

const peerServer = ExpressPeerServer(server, {})

app.use('/yowl', peerServer)
