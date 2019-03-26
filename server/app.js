const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const app = express();
var $ = require('jquery');

debugger;
// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

const port = 3000;

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('dev', { stream: accessLogStream }));

//const instance =axios.create({baseURL: 'http://localhost:3000'});
/*
$(document).ready(function() {
    $.getJSON('https://omdbapi.com/?apikey=8730e0e&i=tt0111161', function(data) {
        $('#movie-title').text(data.Title);
        $('#movie-description').text(data.Description);
        $('#movie-year').text(data.Year);
        console.log('JSON response');
    });
});
*/

hashCode = function(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return Math.abs(h % 16);
};

var hashArray = [];
for(var i = 0; i < 16; ++i) {
    hashArray.push([]);
};

putMovie = function(movieKey, data) {
    console.log('movieKey = ' + movieKey);
    var hash = hashCode(movieKey);
    console.log('hash = ' + hash);
    var line = [movieKey, data];
    hashArray[hash].push(line);
};

getMovie = function(movieKey) {
    console.log('movieKey = ' + movieKey);
    var hash = hashCode(movieKey);
    console.log('hash = ' + hash);
    var bucket = hashArray[hash];
    console.log('bucket = ' + bucket);
    returnLine = null;
    bucket.forEach(function(line) {
        console.log('line = ' + line);
        console.log('line[0] =' + line[0]);
        if(movieKey == line[0]) {
            console.log('line[1] = ' + line[1]);
            returnLine = line[1];
        };
    });
    return returnLine;
};



// tt3896198

app.get('/', function(req, res) {
    
    var id = req.query.i;
    if(id != null) {
        var movieData = getMovie(id);
        console.log('movieData =' + movieData);
        if(movieData != null) {
            res.send(movieData);
            console.log('sent movieData to browser');
            return;
        };  
        console.log('entering axios.get');
        axios.get('http://omdbapi.com/?i=' + id + '&apikey=8730e0e')
            .then(function (response) {
                console.log('in axios.get.then');
                console.log(response.data.Director);
                shortMovieData = {"Title" : response.data.Title, "Year" : response.data.Year};
                putMovie(id, shortMovieData);
                res.send(shortMovieData);
            })
            .catch(function (error) {
                console.log(error);
            });
        return;
        //handle response variable
    };

    var t = req.query.t;
    if(t != null) {
        var data = getMovie(t);
        if(data != null) {
            res.send(data);
            return;
        };  
 
        axios.get('http://omdbapi.com/?t=' + t + '&apikey=8730e0e')
            .then(function (response) {
                console.log('in axios.get.then');
                console.log(response.data);
                putMovie(t, response.data);
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        return;
    };
    res.send('Movie Finder');
    console.log('in home directory');
});

// finally export the express application
module.exports = app;

