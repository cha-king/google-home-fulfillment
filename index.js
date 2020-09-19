const express = require('express');

const app = express();

const AUTH_CODE = 'TEST_AUTH_CODE';

const port = process.env.EXPRESS_PORT;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;

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
