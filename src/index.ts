import express from 'express'
import oauth from './oauth'

const port = 8080


const app = express()


app.get('/', (req, res) => {
    res.send("Sup MF\n")
})

app.post('/fulfillment', (req, res) => {
    console.log(req)
})

app.use('/oauth', oauth)

app.listen(port, () => {
    console.log(`Listening on port ${port}..`)
})
