"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const tsscmp_1 = __importDefault(require("tsscmp"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const body_parser_1 = __importDefault(require("body-parser"));
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const PROJECT_ID = process.env.PROJECT_ID;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_EXPIRATION_SECONDS = 86400;
const REDIRECT_URIS = [
    `https://oauth-redirect.googleusercontent.com/r/${PROJECT_ID}`,
    `https://oauth-redirect-sandbox.googleusercontent.com/r/${PROJECT_ID}`,
];
if (!GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is required");
}
if (!GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is required");
}
if (!PROJECT_ID) {
    throw new Error("PROJECT_ID is required");
}
if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is required");
}
const router = express_1.default.Router();
exports.router = router;
router.get('/auth', (req, res) => {
    // Stubbing out auth for now
    // TODO: Validate credentials and generate authorization code
    // TODO: Verify google client id / secret
    const clientId = req.query['client_id'];
    const redirectUri = req.query['redirect_uri'];
    const state = req.query['state'];
    if (typeof clientId !== "string") {
        res.status(400).send("Invalid client ID");
        return;
    }
    if (!(0, tsscmp_1.default)(clientId, GOOGLE_CLIENT_ID)) {
        res.status(401).send("Unauthorized");
        return;
    }
    if (typeof redirectUri !== 'string') {
        res.status(400).send("Invalid redirect uri");
        return;
    }
    if (!REDIRECT_URIS.some(element => (0, tsscmp_1.default)(element, redirectUri))) {
        res.status(401).send("Unauthorized");
        return;
    }
    // We don't really use this, so just stub it out
    const fakeAuthCode = "123456";
    const url = `${redirectUri}?code=${fakeAuthCode}&state=${state}`;
    res.redirect(url);
});
router.post('/token', body_parser_1.default.urlencoded({ extended: true }), (req, res) => {
    const clientId = req.body['client_id'];
    const clientSecret = req.body['client_secret'];
    if (typeof clientId !== 'string' || typeof clientSecret !== 'string') {
        res.status(400).send("Client ID and secret required");
        return;
    }
    if (!(0, tsscmp_1.default)(clientId, GOOGLE_CLIENT_ID) || !(0, tsscmp_1.default)(clientSecret, GOOGLE_CLIENT_SECRET)) {
        res.status(401).send("Unauthorized");
        return;
    }
    jsonwebtoken_1.default.sign({}, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION_SECONDS }, (err, token) => {
        if (err) {
            throw err;
        }
        if (!token) {
            return;
        }
        const response = {
            'token_type': 'Bearer',
            'access_token': token,
            'expires_in': TOKEN_EXPIRATION_SECONDS,
        };
        if (req.body['grant_type'] === 'authorization_code') {
            response['refresh_token'] = '123456';
        }
        res.send(JSON.stringify(response));
    });
});
const validateToken = function (req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).send("Unauthorized");
        return;
    }
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer') {
        res.status(401).send("Unauthorized");
        return;
    }
    jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err) => {
        if (err) {
            console.error("Error validating token: ", err);
            res.status(401).send("Unauthorized");
        }
        else {
            next();
        }
    });
};
exports.validateToken = validateToken;
