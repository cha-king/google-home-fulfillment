import express from 'express'


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET


const router = express.Router()


router.get('/auth', (req, res) => {
    // Stubbing out auth for now
    // TODO: Validate credentials and generate authorization code
    // TODO: Verify google client id / secret
    const redirectUri = req.query['redirect_uri']
    const state = req.query['state']

    const fakeAuthCode = "123456"

    const url  = `${redirectUri}?code=${fakeAuthCode}&state=${state}`
    res.redirect(url)
})

router.post('/token', (req, res) => {
    res.send(JSON.stringify({
        'token_type': 'Bearer',
        'access_token': 'hehehehehehehe',
        'expires_in': 86400,
    }))
})



export default router
