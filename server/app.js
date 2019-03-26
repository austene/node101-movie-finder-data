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
    console.log('entered putMovie');
    console.log('movieKey = ' + movieKey);
    var hash = hashCode(movieKey);
    console.log('hash = ' + hash);
    var line = [movieKey, data];
    hashArray[hash].push(line);
};

getMovie = function(movieKey) {
    console.log('entered getMovie');
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
   //ID code 
    var id = req.query.i;
    if(id != null) {
        var movieData = getMovie(id);
        if(movieData != null) {
            res.send(movieData);
            return;
        } else { 
            //get data from OMDb
            axios.get(`http://www.omdbapi.com/?i=${id}&apikey=8730e0e`)
                .then(response => {
                    console.log('in axios.get.then');
                    console.log(response.data.Director);
                    shortMovieData = {"Title" : response.data.Title, "Year" : response.data.Year};
                    putMovie(id, shortMovieData);
                    res.send(shortMovieData);
                })
                .catch(error => {
                    console.log(error);
                });
            return;
        };
    };

//Title code
    var title = encodeURIComponent(req.query.t);
    if(title != null) {
        var data = getMovie(title);
        if(data != null) {
            res.send(data);
            return;
        };  
 
        axios.get(`http://www.omdbapi.com/?t=${title}&apikey=8730e0e`)
            .then(function (response) {
                putMovie(title, response.data);
                res.send(response.data);
            })
            .catch(function (error) {
            });
        return;
    };
    res.send('Movie Finder');
});

// finally export the express application
module.exports = app;

