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
const waterfall = require('async-waterfall');
var app = express();
var gClient = g.createClient({key: keys.gKey});
var yClient;
var ySearchResult;

// Read Yelp Categories
var yCategories = require('./resources/categories.json').filter(function(c) {
    return c.country_blacklist? c.country_blacklist.indexOf('US') < 0 : true;
});
var yCategoriesShortCuts = {};
var yUniqueParentCategories = {};
// console.log(yCategories.filter(function(c) {
//     return c.alias == 'realestate';
// }));

// Init Yelp Client
y.accessToken(keys.yId, keys.ySecret).then(function(response) {
    yClient = y.client(response.jsonBody.access_token);

    // Get all location
    var params = {
        location: 'spring shadows',
        radius: 800,
        limit: 50
    };
    yClient.search(params).then(function(response) {
        ySearchResult = response.jsonBody;
        if(ySearchResult.total > ySearchResult.businesses.length) {
            params.offset = ySearchResult.businesses.length;
            var i = Math.ceil((ySearchResult.total -  ySearchResult.businesses.length) / ySearchResult.businesses.length);
            var arr = [];
            for(var j = 0; j < i; j++) {
                arr.push(true);
            }
            arr = arr.map(function() {
                return function(p, j, callback) {
                    yClient.search(p).then(function(r) {
                        j.businesses = j.businesses.concat(r.jsonBody.businesses);
                        p.offset = j.businesses.length;
                        callback(null, p, j);
                    }).catch(function() {
                        callback(true);
                    });
                };
            });

            waterfall([function(callback) {
                callback(null, params, ySearchResult);
            }].concat(arr), function(err, p, j) {
                if(err) {
                    ySearchResult = {total: 0, error: true};
                } else {
                    ySearchResult = j;
                    ySearchResult.businesses.forEach(function(b) {
                        findBusinessCategoryParentHelper(b);
                    });
                    // ySearchResult.categories = yCategoriesShortCuts;
                    ySearchResult.categoryHeaders = yUniqueParentCategories;
                }
            });
        }
    }).catch(function(e) {
        ySearchResult = {total: 0, error: true};
    });

}).catch(function(e) {
    console.err(e);
});

// console.log(findParents('swimminglessons'));
// console.log(findParents('restaurants'));
// console.log(findParents('apartments'));
// console.log(findParents('apartments'));
// console.log(findParents('mortgagebrokers'));

////////// SERVER UTILS //////////
function findParents(alias) {
    // TODO: Get parent by child. Capable of having multiple parents
    if(yCategoriesShortCuts[alias]) {
        return yCategoriesShortCuts[alias];
    }
    var t = yCategories.find(function(c) {
        return c.alias == alias;
    });
    if(t) {
        if(t.parents.length === 0) {
            if(!yUniqueParentCategories[t.alias]) {
                yUniqueParentCategories[t.alias] = t;
            }
            return t;
        } else if(t.parents.length === 1) {
            return findParents(t.parents[0]);
        } else {
            var a = [];
            t.parents.forEach(function(p) {
                a.push(findParents(p));
            });
            return a;
        }
    } else {
        return [];
    }
}

function findBusinessCategoryParentHelper(b) {
    if(b.parentCategories) {
        return;
    }
    b.parentCategories = [];
    b.categories.forEach(function(c) {
        if(!yCategoriesShortCuts[c.alias]) {
            yCategoriesShortCuts[c.alias] = findParents(c.alias);
        }

        if(Array.isArray(yCategoriesShortCuts[c.alias])) {
            b.parentCategories = b.parentCategories.concat(yCategoriesShortCuts[c.alias]);
        } else {
            b.parentCategories.push(yCategoriesShortCuts[c.alias]);
        }
    });
}
/////////////////////////////////

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

    if(ySearchResult.error) {
        res.status(500).json(ySearchResult);
    } else {
        res.json(ySearchResult);
    }
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
