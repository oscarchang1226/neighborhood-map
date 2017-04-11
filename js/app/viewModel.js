define([
    'models',
    'knockout',
    'googlemap',
    'yelpfusion'
], function(m, ko, g, y) {

    return ViewModel;

    function ViewModel() {
        var mapEvents = {
            click: function(e) {
                // if(e.placeId) {
                //     e.stop();
                //     g.removeMarker();
                //     g.getDetails(e.placeId).done(function(data) {
                //         if(data.status == 'OK') {
                //             g.panMap(data.result.geometry.location);
                //             g.createMarker(data.result.geometry.location);
                //         } else {
                //             window.alert('Something went wrong. Unable to retrieve place details.');
                //         }
                //     });
                // }
            }
        };
        g.initMap(mapEvents);

        var vm = this;
        vm.locations = ko.observableArray();
        vm.total = ko.observable(0);
        vm.showInfo = ko.observable(false);
        vm.focusedLocation = ko.observable({
            id:0,
            name: '',
            rating: '',
            price: '',
            display_phone: '',
            image_url: '',
            location: {
                display_address: []
            },
            reviews: [],
            url: ''
        });
        vm.closeMenu = ko.observable(true);
        vm.checkFocused = ko.pureComputed(function(data){
            return vm.focusedLocation()? vm.focusedLocation().id == data.id : false;
        });
        vm.optionsFilters = ko.observableArray([
            new m.OptionsFilter('Restaurants', 'restaurants'),
            new m.OptionsFilter('Apartments', 'apartments'),
            new m.OptionsFilter('Banks', 'banks'),
            new m.OptionsFilter('Grocery', 'grocery'),
            new m.OptionsFilter('Health', 'health'),
            new m.OptionsFilter('Fitness', 'fitness'),
            new m.OptionsFilter('Hotels', 'hotelstravel')
        ]);
        vm.selectedFilter = ko.observable({});
        vm.keyword = ko.observable('');

        search();

        vm.mouseOverLocation = mouseOverLocation;
        vm.mouseOutLocation = mouseOutLocation;
        vm.clickLocation = clickLocation;
        vm.scrollLocation = scrollLocation;
        vm.toggleMenu = toggleMenu;
        vm.clearLocations = clearLocations;
        vm.search = search;
        vm.hideInfo = hideInfo;
        vm.getStarRatings = getStarRatings;
        vm.clearFocused = clearFocused;
        vm.recenter = g.recenter;

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
                vm.showInfo(true);
                return;
            }
            g.nearbySearch({
                location: obj.coordinates.latitude+','+obj.coordinates.longitude,
                keyword: obj.name
            }).done(function(gData) {
                y.getReviews(obj.id).done(function(data) {
                    var latLng = {
                        lat: obj.coordinates.latitude,
                        lng: obj.coordinates.longitude
                    };
                    if(gData.results.length > 0) {
                        var temp = gData.results.find(function(place) {
                            return place.name.toLowerCase().indexOf(obj.name.toLowerCase()) > -1;
                        });
                        latLng = temp? temp.geometry.location : latLng;
                    }
                    g.panFocused(latLng, {click: function(){
                        vm.closeMenu(false);
                        vm.showInfo(true);
                    }});
                    g.panMap(latLng);
                    if(!obj.price) {
                        obj.price = '';
                    }
                    obj.reviews = data.reviews;
                    vm.focusedLocation(obj);
                    vm.showInfo(true);
                });
            });
        }

        function scrollLocation(data, e) {
            if(!vm.fetching && vm.total() > vm.locations().length) {
                ele = e.target;
                if((ele.scrollTop + ele.offsetHeight) > (ele.scrollHeight - 100)) {
                    search();
                }
            }
        }

        function toggleMenu() {
            vm.closeMenu(!vm.closeMenu());
        }

        function generateParameters() {
            var params = {
                limit: 30,
                offset: vm.locations().length
            };
            if(vm.selectedFilter()) {
                params.categories = vm.selectedFilter().value;
            }
            if(vm.keyword() && vm.keyword().trim().length > 3) {
                params.term = vm.keyword();
            }
            return params;
        }

        function clearLocations() {
            vm.locations.removeAll();
        }

        function search(params) {
            if(!params) {
                params = generateParameters();
            }
            if(!vm.fetching) {
                vm.fetching = true;
                y.search(params).done(function(data) {
                    vm.total(data.total);
                    g.extendBounds(data.businesses.map(function(b) {
                        vm.locations.push(b);
                        return b.coordinates;
                    }));
                    vm.fetching = false;
                });
            }
        }

        function hideInfo() {
            vm.showInfo(false);
        }

        function getStarRatings(rating) {
            var s = '';
            while(rating >= 1) {
                s += '<i class="material-icons">star</i>';
                rating -= 1;
            }
            if(rating >= 0.5) {
                s += '<i class="material-icons">star_half</i>';
            }
            return s;
        }

        function clearFocused() {
            g.removeFocused();
            hideInfo();
            vm.focusedLocation({
                id:0,
                name: '',
                rating: '',
                price: '',
                display_phone: '',
                image_url: '',
                location: {
                    display_address: []
                },
                reviews: [],
                url: ''
            });
        }
    }

});
