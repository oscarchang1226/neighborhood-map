/**
References
    https://expressjs.com/
    https://scotch.io/tutorials/use-expressjs-to-deliver-html-files
**/

const express = require('express');
const port = 1226;
const path = require('path');
const g = require('@google/maps');
const y = require('yelp-fusion');
const keys = require('./keys.js');
var app = express();
var gClient = g.createClient({key: keys.gKey});
var yClient;

// Init Yelp Client
y.accessToken(keys.yId, keys.ySecret).then(function(response) {
    yClient = y.client(response.jsonBody.access_token);
}).catch(function(e) {
    console.err(e);
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/google/nearbySearch', function(req, res) {
    if(!req.query.location) {
        res.status(400).json({error: 'location query is required'});
    }
    var params = {
        location: req.query.location,
        radius: 500,
        keyword: req.query.keyword || null
    };
    gClient.placesNearby(params, function(err, response) {
        if(err) {
            res.status(response.status).json(response.json);
        } else {
            res.json(response.json);
        }
    });
});

app.get('/google/placeDetails/:placeId', function(req, res) {
    gClient.place({placeid:req.params.placeId}, function(err, response) {
        if(err) {
            res.status(response.status).json(response.json);
        } else {
            res.json(response.json);
        }
    });
});

app.get('/yelp/search', function(req, res) {
    // if(!req.query.hasOwnProperty('latitude') || !req.query.hasOwnProperty('longitude')) {
    //     req.query.latitude = 29.8179022;
    //     req.query.longitude = -95.53548160000001;
    // }
    req.query.location = 'spring shadows';
    req.query.radius = req.query.radius || 800;

    yClient.search(req.query).then(function(response) {
        res.json(response.jsonBody);
    }).catch(function(e) {
        res.status(500).json({total: 0});
    });

});

app.get('/yelp/business/:id/reviews', function(req, res) {
    yClient.reviews(req.params.id).then(function(response) {
        res.json(response.jsonBody);
    }).catch(function(e) {
        res.status(500).json({});
    });
});

app.listen(port, function(err) {
    if(err) {
        return console.log('Something went wrong', err);
    }

    console.log('Listening on port ' + port);
});
