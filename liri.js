require("dotenv").config();

var fs = require("fs");   //NPM package for reading and writing files
var request = require("request");   //NPM package foe making Ajax like calls
var keys = require ("./keys.js");   //Twitter keys and access tokens


var Twitter = require("twitter");   //NPM package for twitter


var client = new Twitter(keys.twitter);


var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);	//NPM package for spotify

var userOrder = process.argv[2];
var contentName = process.argv[3];

performNext(userOrder, contentName);


function performNext(uO, cN){
	switch(uO){
		case 'my-tweets':
			myTweets();
		break;

	case "spotify-this-song":
		spotifyThisSong(cN);
	break;

	case "movie-this":
		fetchOMDB(cN);
	break;

	case "do-as-it-says":
		fetchRandom();
	break;

	default:
	break;
	}
}

// Tweet function, uses the Twitter module to call the Twitter api
	function myTweets() {

		params = {screen_name: "simran_11518"};
		console.log(params);

		
		client.get("statuses/user_timeline", params, function(error, data, response){
			// console.log(data);
			for(var i = 0; i < data.length; i++) {
			// 		
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\r\n" + 
					data[i].created_at + "\r\n" + 
					"------------------------------ " + i + " ------------------------------" + "\r\n";
			 		console.log(twitterResults);
					appendFile(twitterResults);
				}
			
			});
		}

function spotifyThisSong(songName) {
		var songName = process.argv[3];
		
		if(!songName){
			songName = "I Want it That Way";
		}
		
		params = songName;
		
		spotify.search({ type: "track", query: params }, function(err, data) {
			
			if(!err){
				var songInfo = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songInfo[i] != undefined) {
						var spotifyResults =
						"Here's the Artist: " + songInfo[i].artists[0].name + "\r\n" +
						"Here's the Song: " + songInfo[i].name + "\r\n" +
						"Here's the Album the song is from: " + songInfo[i].album.name + "\r\n" +
						"Check out this Preview Url: " + songInfo[i].preview_url + "\r\n" + 
						"------------------------------ " + i + " ------------------------------" + "\r\n";
						console.log(spotifyResults);
						appendFile(spotifyResults);
						
					}
				}
			}	else {
				console.log("Error :"+ err);
				return;
			}
		});
	};


function fetchOMDB(movieName){
	//If a movie was not entered, default to the movie Mr. Nobody
	var userOrder = process.argv[2];
	var contentName = process.argv[3];

	if (contentName == null){
		movieName = "Mr. Nobody";
	}

	var requestURL = "http://www.omdbapi.com/?t=" + movieName + "&tomatoes=true&y=&plot=short&apikey=trilogy";

	request(requestURL, function(error, response, data){

		//200 response means that the page was found and a response received
		if (!error && response.statusCode == 200){
				console.log(requestURL);
		}
		console.log("-------------------------------------------------------");
		console.log("The movie's title is: " + JSON.parse(data)["Title"]+ "\r\n");
		console.log("The movie's release year is: " + JSON.parse(data)["Year"]+ "\r\n");
		console.log("The movie's rating is: " + JSON.parse(data)["imdbRating"]+ "\r\n");
		console.log("The movie was produced in: " + JSON.parse(data)["Country"]+ "\r\n");
		console.log("The movie's language is: " + JSON.parse(data)["Language"]+ "\r\n");
		console.log("The movie's plot is: " + JSON.parse(data)["Plot"]+ "\r\n");
		console.log("The movie's actors are: " + JSON.parse(data)["Actors"]+ "\r\n");
		console.log("The movie's Rotten Tomatoes Rating is: " + JSON.parse(data)["tomatoRating"]+ "\r\n");
		console.log("The movie's Rotten Tomatoes URL is: " + JSON.parse(data)["tomatoURL"]+ "\r\n");
		appendFile("-------------------------------------------------------"+ "\r\n");
		appendFile("The movie's title is: " + JSON.parse(data)["Title"]+ "\r\n");
		appendFile("The movie's release year is: " + JSON.parse(data)["Year"]+ "\r\n");
		appendFile("The movie's rating is: " + JSON.parse(data)["imdbRating"]+ "\r\n");
		appendFile("The movie was produced in: " + JSON.parse(data)["Country"]+ "\r\n");
		appendFile("The movie's language is: " + JSON.parse(data)["Language"]+ "\r\n");
		appendFile("The movie's plot is: " + JSON.parse(data)["Plot"]+ "\r\n");
		appendFile("The movie's actors are: " + JSON.parse(data)["Actors"]+ "\r\n");
		appendFile("The movie's Rotten Tomatoes Rating is: " + JSON.parse(data)["tomatoRating"]+ "\r\n");
		appendFile("The movie's Rotten Tomatoes URL is: " + JSON.parse(data)["tomatoURL"]+ "\r\n");

	});
}

function fetchRandom(){
	//Take the text in random.txt and use it to call one of Liri's commands
	//Runs 'spotify-this-song' for "I Want it That Way" as in random.txt
	fs.readFile("random.txt", "utf8", function(err,data){
		var dataArray = data.split(',');

		var randomUserCommand = dataArray[0];
		var randomContentName = dataArray[1];

		console.log("You requested to " + "<" + randomUserCommand + "> with " + randomContentName);
		appendFile("You requested to " + "<" + randomUserCommand + "> with " + randomContentName);

		randomContentName = randomContentName.replace(/^"(.*)"$/, '$1');

		performNext(randomUserCommand, randomContentName);

	});
}

function appendFile(dataToAppend){

	fs.appendFile("log.txt", dataToAppend, function(error){
		if (error){
			return console.log(error);
		}
	});
}
