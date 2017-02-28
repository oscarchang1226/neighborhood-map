require.config({
    paths: {
        knockout: "../bower_components/knockout/dist/knockout",
        text: "../bower_components/text/text"
    }
});

require([
    "knockout",
    "google-map/main"
], function(ko, GoogleMap) {
    "use strict";

    ko.components.register("google-map", GoogleMap);

    ko.applyBindings();


});
