require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var input = process.argv[3];
var moment = require("moment");

// Process the command from node input line
switch (command) {
    case "concert-this":
        bandsInTownArtistEvents();
        break;
    case "spotify-this-song":
        spotifySong();
        break;
    case "movie-this":
        moviesOMDB();
        break;
    case "do-what-it-says":
        fixedSongAndText();
        break;
}

function bandsInTownArtistEvents() {

    // This is how we run a request with axios to the Bands in Town Artist Event API 
    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"


    axios.get(queryUrl).then(

        function (response) {
            
            // Here it prints out the list of the upcoming artist and band conserts.
            for (var i = 0; i < response.data.length; i++) {
                console.log("----------------------");
                console.log("Name of the venue: " + response.data[i].venue.name);
                console.log("Venue location for event: " + response.data[i].venue.city);
                console.log("Date of the event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("----------------------");
            }
        }
    )
};

function moviesOMDB() {

    // If user does not specify the movie name, it will automatically type info for The Lion King movie
    if (!input) {
        console.log("If you have not seen this movie, you should!");
        input = "The Lion King";
    };

    // Run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    // This line helps debug against the actual URL.
    axios.get(queryUrl).then(
        function (response) {

            //Printing out the movie info
            console.log("----------------------");
            console.log("Title of the movie: " + response.data.Title);
            console.log("Year the movie came out: " + response.data.Released);
            for (var i = 0; i < (response.data.Ratings.length - 2); i++) {
                console.log("IMDB Rating of the movie: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
            }
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language of the movie: " + response.data.Language);
            console.log("Plot of the movie: " + response.data.Plot);
            console.log("Actors in the movie: " + response.data.Actors);
            console.log("----------------------");
        }
    );
}

function fixedSongAndText() {

    // This block of code will read from the "random.txt" file.
    // The code will store the contents of the reading inside the variable "data"

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        input = dataArr[1];
        console.log(input);
        spotifySong(input);
    });
}

function spotifySong() {
    ////If user has not specified a song , default to "I will always love you" by Witney Houston
    if (!input) {
        console.log("Let's look at this hit!");
        input = "I will always love you";
    }

    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songInfo = data.tracks.items;
        console.log("----------------------");
        console.log("Artist name: " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);
        console.log("----------------------");
    });
}
