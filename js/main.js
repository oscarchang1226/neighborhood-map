requirejs.config({
    paths: {
        'knockout': '../bower_components/knockout/dist/knockout',
        'jquery': '../bower_components/jquery/dist/jquery.min',
        'googlemap': 'app/googlemap',
        'yelpfusion': 'app/yelpfusion',
        'async': '../bower_components/requirejs-plugins/src/async'
    }
});

requirejs([
    'knockout',
    'googlemap',
    'yelpfusion'
], function(ko, g, y) {

    function ViewModel() {
        var mapEvents = {
            click: function(e) {
                if(e.placeId) {
                    e.stop();
                    g.removeMarker();
                    g.getDetails(e.placeId).done(function(data) {
                        if(data.status == 'OK') {
                            g.panMap(data.result.geometry.location);
                            g.createMarker(data.result.geometry.location);
                        } else {
                            window.alert('Something went wrong. Unable to retrieve place details.');
                        }
                    });
                }
            }
        };
        g.initMap(mapEvents);

        var vm = this;
        vm.locations = ko.observableArray();
        y.search().done(function(data) {
            g.extendBounds(data.businesses.map(function(b) {
                vm.locations.push(b);
                return b.coordinates;
            }));
        });

        vm.mouseOverLocation = mouseOverLocation;
        vm.mouseOutLocation = mouseOutLocation;

        function mouseOverLocation(obj) {
            console.log(obj.coordinates);
        }

        function mouseOutLocation() {

        }

    }

    ko.applyBindings(new ViewModel());
});
