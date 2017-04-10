requirejs.config({
    paths: {
        'knockout': '../bower_components/knockout/dist/knockout',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'models': 'app/models',
        'viewModel': 'app/viewModel',
        'googlemap': 'app/googlemap',
        'yelpfusion': 'app/yelpfusion',
        'async': '../bower_components/requirejs-plugins/src/async'
    }
});

requirejs([
    'knockout',
    'viewModel'
], function(ko, ViewModel) {

    var v = new ViewModel();

    v.selectedFilter.subscribe(function(filter) {
        v.clearLocations();
        v.search();
    });

    v.keyword.subscribe(function(keyword) {
        v.clearLocations();
        v.search();
    });

    ko.applyBindings(v);
});
