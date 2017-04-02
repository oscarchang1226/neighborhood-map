define([
    'jquery'
], function($) {

    function search(q) {
        return $.ajax({
            method: 'GET',
            url: '/yelp/search',
            data: q
        });
    }

    function getReviews(q) {
        return $.ajax({
            method: 'GET',
            url: '/yelp/business'+q+'/reviews'
        });
    }

    return {
        search: search,
        getReviews: getReviews
    };
});
