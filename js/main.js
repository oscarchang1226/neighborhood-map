requirejs.config({
    paths: {
        'knockout': '../bower_components/knockout/dist/knockout',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'models': 'app/models',
        'viewModel': 'app/viewModel',
        'googlemap': 'app/googlemap',
        'yelpfusion': 'app/yelpfusion',
        'async': '../bower_components/requirejs-plugins/src/async',
        'googlemapsapi': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw'
    },
    catchError: {
        define: true
    },
    waitSeconds: 3
});

requirejs([
    'knockout',
    'viewModel'
], function(ko, ViewModel) {

    var v = new ViewModel();

    v.selectedFilter.subscribe(function(filter) {
        v.clearFocused();
        v.filterLocation();
    });

    v.keyword.subscribe(function(keyword) {
        v.clearFocused();
        v.filterLocation();
    });

    ko.applyBindings(v);

}, function(errObject) {
    requireType = errObject.requireType;
    requireModules = errObject.requireModules;
    console.error(requireType);
    console.error(requireModules);
    window.alert('Oh No! Something went wrong... \n\nError type: ' + requireType + '\n\nOccured for modules: \n\n' + requireModules.join('\n') + '\n');
});
