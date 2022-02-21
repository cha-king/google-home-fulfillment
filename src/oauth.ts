import express from 'express'


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

/*
There are some quirks to how we use OAuth here. The main takeaway is
that we don't actually have users, since the fulfillment app isn't
actually deployed. This being the case, we only really care about
authenticating Google, which the client ID / secret is sufficient for.

What this means for us is:
    - We can pretty much stub out the auth endpoint
    - We don't care about authorization code or refresh tokens
    - We still want to generate and check short(ish)-lived auth tokens
      but we can just assume client id / secret is enough to give this out
*/


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
