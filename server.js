const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
require('dotenv').config({ path: 'variables.env' });
const path = require('path');

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        console.log('Access token expires in ' + data.body['expires_in']);

        // Save the access token for future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Error while retrieving access token', err.message);
    });

app.get("/search", function (request, response) {
    spotifyApi.searchTracks(request.query.term, { limit: 8 })
        .then(function (data) {
            response.send(data.body);
        }, function (err) {
            console.log(err)
        });
});

app.get("/features", function (request, response) {
    spotifyApi.getAudioFeaturesForTrack(request.query.id)
        .then(function (data) {
            response.send(data.body);
        }, function (err) {
            console.log(err)
        });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get("*", function (request, response) {
        response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on ${port}`));
