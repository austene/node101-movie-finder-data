# node101-movie-data-finder

## Purpose of Program
To reduce wait time for common searches at the Open Movie Database API website, this code returns requested data (query via ID or Title) and then stores data in a cache.  It will then return the data via the cache (not the OMDbapi site) if a second request is made.

## Setup
```
$ npm install
```
```
$ npm install morgan
```
```
$ npm install axios
```
```
$ npm install express
```
```
$ npm install nodemon
```

## Run
```
$ npm start
```

or for automatically restarting when the file changes
```
$ npm run dev
```

## Now
Use the URL to deploy to NOW
>https://movie-finder-data-o9e3fv0ew.now.sh

