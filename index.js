const express = require('express');
const bodyParser = require('body-parser')
const googleApp = require('./actions.js');


const port = process.env.EXPRESS_PORT;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
const AUTH_CODE = 'AUTH'


const app = express();

const jsonParser = bodyParser.json();
app.post('/fulfillment', jsonParser, googleApp);

app.get('/health', (req, res) => {
    const response = {
        'status': 'healthy'
    };

    res.json(response);
});

app.get('/auth', (req, res) => {
    const redirect_uri = req.query.redirect_uri + `?code=${AUTH_CODE}&state=${req.query.state}`;

    res.redirect(redirect_uri);
});

app.post('/token', (req, res) => {
    const response = {
        token_type: "Bearer",
        access_token: "ACCESS_TOKEN",
        refresh_token: "REFRESH_TOKEN",
        expires_in: 300
    }

    res.json(response);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


