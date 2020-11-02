const express = require('express');
const serverless = require('serverless-http');

const app = express();

const router = express.Router();


router.get("/", (req, response) => {

    const request = require('request');

    const client_id = "37eaba6e04e343259fc399757e7e2e75";
    const client_secret = "80ef3f8e3de94432933dc6ce1cfd7e63";
    const refresh_token = "AQAEWNFSUmE-vVgfhbbhthyRvyzjzv13nVjr5qdvx_BboGh4axBUHGo0CRYFS1eV0vCBs_n_gwCh7_K7t45gnLkp-Msie7ZdigbF6hONz0-J3Z642H8RFfFbA72QL1g7D_0";

    // const client_id = process.env.CLIENT_ID;
    // const client_secret = process.env.CLIENT_SECRET;
    // const refresh_token = process.env.REFRESH_TOKEN;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: { grant_type: 'refresh_token', refresh_token: refresh_token }
    };

    request.post(authOptions, function(error, res) {
        var header = { 'Authorization': 'Bearer ' + (JSON.parse(res.body)).access_token };
        var song_name, artist, song_url, artist_url;
        request({ url: "https://api.spotify.com/v1/me/player/currently-playing?", headers: header }, function(error, res, body) {
            if((res.statusCode == 204) || JSON.parse(body).currently_playing_type != "track") {
                request({ url:"https://api.spotify.com/v1/me/player/recently-played?type=track&limit=1", headers: header }, function(error, res, body) {
                    var body_text = JSON.parse(body);
                    var track = body_text.items[0].track;
                    song_name = track.name;
                    artist = track.artists[0].name;
                    song_url = track.external_urls.spotify;
                    artist_url = track.album.artists[0].external_urls.spotify;
                    response.json({ "song_name": song_name, "artist": artist, "song_url": song_url, "artist_url": artist_url });
                });
            } else {
                var body_text = JSON.parse(body);
                song_name = body_text.item.name;
                artist = body_text.item.artists[0].name;
                song_url = body_text.item.external_urls.spotify;
                artist_url = body_text.item.artists[0].external_urls.spotify;
                response.json({ "song_name": song_name, "artist": artist, "song_url": song_url, "artist_url": artist_url });
            }
        });

    });

});

app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);
