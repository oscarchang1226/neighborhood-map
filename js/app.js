require.config({
    paths: {
        knockout: '../bower_components/knockout/dist/knockout',
        async: '../bower_components/requirejs-plugins/src/async'
    }
});

require([
    'knockout',
    'viewmodels/viewmodel'
], function(ko) {
    'use strict';

    var NEIGHBORHOOD_ID = 'ChIJGZudLZ3FQIYREC4v5KoYUlg';

}, function(err) {
    console.error('Unable to load dependencies.', err);
});
