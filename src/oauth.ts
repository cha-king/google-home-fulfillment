import express, { RequestHandler } from 'express'
import safeCompare from 'tsscmp'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const PROJECT_ID = process.env.PROJECT_ID
const TOKEN_SECRET = process.env.TOKEN_SECRET

const TOKEN_EXPIRATION_SECONDS = 86400

const REDIRECT_URIS = [
    `https://oauth-redirect.googleusercontent.com/r/${PROJECT_ID}`,
    `https://oauth-redirect-sandbox.googleusercontent.com/r/${PROJECT_ID}`,
]

if (!GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is required")
}

if (!GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is required")
}

if (!PROJECT_ID) {
    throw new Error("PROJECT_ID is required")
}

if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is required")
}

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
    const clientId = req.query['client_id']
    const redirectUri = req.query['redirect_uri']
    const state = req.query['state']

    if (typeof clientId !== "string") {
        res.status(400).send("Invalid client ID")
        return
    }

    if (!safeCompare(clientId, GOOGLE_CLIENT_ID)) {
        res.status(401).send("Unauthorized")
        return
    }

    if (typeof redirectUri !== 'string') {
        res.status(400).send("Invalid redirect uri")
        return
    }

    if (!REDIRECT_URIS.some(element => safeCompare(element, redirectUri))) {
        res.status(401).send("Unauthorized")
        return
    }

    // We don't really use this, so just stub it out
    const fakeAuthCode = "123456"

    const url  = `${redirectUri}?code=${fakeAuthCode}&state=${state}`
    res.redirect(url)
})

router.post('/token', bodyParser.urlencoded({ extended: true }), (req, res) => {
    const clientId = req.body['client_id']
    const clientSecret = req.body['client_secret']
    if (typeof clientId !== 'string' || typeof clientSecret !== 'string') {
        res.status(400).send("Client ID and secret required")
        return
    }
    if (!safeCompare(clientId, GOOGLE_CLIENT_ID) || !safeCompare(clientSecret, GOOGLE_CLIENT_SECRET)) {
        res.status(401).send("Unauthorized")
        return
    }

    const token = jwt.sign({}, TOKEN_SECRET, {expiresIn: TOKEN_EXPIRATION_SECONDS})

    res.send(JSON.stringify({
        'token_type': 'Bearer',
        'access_token': token,
        'expires_in': TOKEN_EXPIRATION_SECONDS,
    }))
})


const validateToken: RequestHandler = function(req, res, next) {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).send("Unauthorized")
        return
    }

    const [type, token] = auth.split(' ')
    if (type !== 'Bearer') {
        res.status(401).send("Unauthorized")
        return
    }

    try {
        jwt.verify(token, TOKEN_SECRET)
    } catch(err) {
        console.error("Error validating token: ", err)
        res.status(401).send("Unauthorized")
        return
    }
    next()
}


export { router, validateToken }
