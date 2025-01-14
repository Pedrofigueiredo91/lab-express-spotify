require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => 
    spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get("/", (req, res, next) => res.render("index"))

app.get("/artist-search-results", (req, res) => {
  const artistName = req.query.artistsName; // Use req.query to get the query parameter

  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
      console.log(artists)
    })
    .catch(error => {
      console.log('The error while searching artists occurred: ', error);
      res.render('error'); // Render an error view
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
