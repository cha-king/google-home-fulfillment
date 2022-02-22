import express from 'express'
import bodyParser from 'body-parser'

import * as oauth from './oauth'
import actions from './actions'

const port = 8080


const app = express()


app.get('/', (req, res) => {
    res.send("Sup MF\n")
})

app.post('/fulfillment', oauth.validateToken, bodyParser.json(), actions)

app.use('/oauth', oauth.router)

const listener = app.listen(port, () => {
    console.log(`Listening on port ${port}..`)
})



const shutdown: NodeJS.SignalsListener = function(signal) {
    console.log(`${signal} received. Exiting..`)
    listener.close()
    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
