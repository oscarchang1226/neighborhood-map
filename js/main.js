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
        vm.total = ko.observable(0);
        y.search({limit: 30}).done(function(data) {
            vm.total(data.total);
            g.extendBounds(data.businesses.map(function(b) {
                vm.locations.push(b);
                return b.coordinates;
            }));
        });

        vm.focusedLocation = ko.observable({id:0});

        vm.checkFocused = ko.pureComputed(function(data){
            return vm.focusedLocation()? vm.focusedLocation().id == data.id : false;
        });

        vm.mouseOverLocation = mouseOverLocation;
        vm.mouseOutLocation = mouseOutLocation;
        vm.clickLocation = clickLocation;
        vm.scrollLocation = scrollLocation;

        function mouseOverLocation(obj) {
            g.panMarker({
                lat: obj.coordinates.latitude,
                lng: obj.coordinates.longitude
            });
        }

        function mouseOutLocation() {
            g.removeMarker();
        }

        function clickLocation(obj) {
            if(vm.focusedLocation() && vm.focusedLocation().id == obj.id) {
                return;
            }
            g.nearbySearch({
                location: obj.coordinates.latitude+','+obj.coordinates.longitude,
                radius: 500,
                keyword: obj.name
            }).done(function(gData) {
                y.getReviews(obj.id).done(function(data) {
                    g.panFocused({
                        lat: obj.coordinates.latitude,
                        lng: obj.coordinates.longitude
                    });
                    vm.focusedLocation(obj);
                });
            });
        }

        function scrollLocation(data, e) {
            if(!vm.fetching && vm.total() > vm.locations().length) {
                ele = e.target;
                if((ele.scrollTop + ele.offsetHeight) > (ele.scrollHeight - 100)) {
                    vm.fetching = true;
                    y.search({limit: 30, offset: vm.locations().length}).done(function(data) {
                        g.extendBounds(data.businesses.map(function(b) {
                            vm.locations.push(b);
                            return b.coordinates;
                        }));
                        vm.fetching = false;
                    });
                }
            }
        }


    }

    ko.applyBindings(new ViewModel());
});
