import express from 'express'
import bodyParser from 'body-parser'

import oauth from './oauth'
import actions from './actions'

const port = 8080


const app = express()


app.get('/', (req, res) => {
    res.send("Sup MF\n")
})

app.post('/fulfillment', bodyParser.json(), actions)

app.use('/oauth', oauth)

app.listen(port, () => {
    console.log(`Listening on port ${port}..`)
})
