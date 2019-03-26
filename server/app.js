const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const app = express();
var $ = require('jquery');

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

const port = 3000;

//logs incoming requests through Morgan
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('dev', { stream: accessLogStream }));

//Function Definitions

    //hash function
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
    //cache function
putMovie = function(movieKey, data) {
    var hash = hashCode(movieKey);
    var line = [movieKey, data];
    hashArray[hash].push(line);
};

    //check cache function and return if correct data is present
getMovie = function(movieKey) {
    var hash = hashCode(movieKey);
    var bucket = hashArray[hash];
    returnLine = null;
    bucket.forEach(function(line) {
        if(movieKey == line[0]) {
            returnLine = line[1];
        };
    });
    return returnLine;
};

//CODE
app.get('/', function(req, res) {
   
    //code for ID query
    var id = req.query.i;
    if(id != null) {
        var data = getMovie(id);
        if(data != null) { //if data present in movie cache, return data
            res.send(data);
            return; //if data not present, go to axios.get
        } else { 
            //get data from OMDb
            axios.get(`http://www.omdbapi.com/?i=${id}&apikey=8730e0e`)
                .then(response => {
                    putMovie(id, response.data);
                    res.send(response.data);
                })
                .catch(error => {
                });
            return;
        };
    };

    //code for Title query
    var title = encodeURIComponent(req.query.t); //need encode for the title to remain same during the mock adapter test
    if(title != null) {
        var data = getMovie(title);
        if(data != null) { //if data present in movie cache, return data
            res.send(data);
            return; //if data not present, go to axios.get
        };  
        //get data from OMDb
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

