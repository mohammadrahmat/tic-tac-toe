const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

let firstPlayer = true

io.on('connect', (client) => {
    
    console.log(`new client: ${client.id}`)
    
    io.to(client.id).emit('init', {
        clientID: client.id,
        clientType: firstPlayer ? 'X' : 'O'
    })

    firstPlayer = !firstPlayer

    client.on('next player', (msg) => {
        io.emit('message', {
            squares: msg.squares,
            fromClient: msg.fromClient
        })
    })

    client.on('disconnect', () => {
        console.log('client disconnected')
    })
})

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})