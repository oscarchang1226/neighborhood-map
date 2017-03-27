requirejs.config({
    paths: {
        'knockout': '../bower_components/knockout/dist/knockout',
        'googlemap': 'app/googlemap',
        'async': '../bower_components/requirejs-plugins/src/async'
    }
});

requirejs([
    'knockout',
    'googlemap'
], function(ko, g) {

    g.initMap();
});
