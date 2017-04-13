define([
    'models',
    'knockout',
    'googlemap',
    'yelpfusion'
], function(m, ko, g, y) {

    return ViewModel;

    function ViewModel() {
        var vm = this;
        vm.locations = ko.observableArray();
        vm.allLocations = ko.observableArray();
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
            // new m.OptionsFilter('Restaurants', 'restaurants'),
            // new m.OptionsFilter('Apartments', 'apartments'),
            // new m.OptionsFilter('Banks', 'banks'),
            // new m.OptionsFilter('Grocery', 'grocery'),
            // new m.OptionsFilter('Health', 'health'),
            // new m.OptionsFilter('Fitness', 'fitness'),
            // new m.OptionsFilter('Hotels', 'hotelstravel')
        ]);
        vm.selectedFilter = ko.observable({});
        vm.keyword = ko.observable('');

        var mapEvents = {
            dragstart: function() {
                vm.closeMenu(true);
            },
            click: function(e) {
                vm.closeMenu(true);
            },
            idle: search
        };
        g.initMap(mapEvents);

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
        vm.filterLocation = filterLocation;
        vm.recenter = g.recenter;

        function mouseOverLocation(obj) {
            // g.panMarker({
            //     lat: obj.coordinates.latitude,
            //     lng: obj.coordinates.longitude
            // });

            // if(obj.marker) {
            //     g.toggleBounce(obj.marker);
            // }
        }

        function mouseOutLocation(obj) {
            // g.removeMarker();
            // if(obj.marker) {
            //     g.toggleBounce(obj.marker);
            // }
        }

        function clickLocation(obj) {
            if(vm.focusedLocation() && vm.focusedLocation().id == obj.id) {
                vm.showInfo(true);
                return;
            }

            if(!obj.markerConfigured) {
                var latLng = {
                    lat: obj.coordinates.latitude,
                    lng: obj.coordinates.longitude
                };

                g.nearbySearch({
                    location: obj.coordinates.latitude+','+obj.coordinates.longitude,
                    keyword: obj.name
                }).done(function(gData) {

                    var temp = gData.results.length == 1? gData.results.pop() : null;

                    if(temp) {
                        latLng = temp.geometry.location;
                        // g.panFocused(latLng, focusedEvents);
                        obj.marker.setPosition(latLng);

                    }
                    obj.markerConfigured = true;
                    g.panMap(latLng);

                }).fail(function() {
                    window.alert('Unable to locate or pin point the coordinates of ' + obj.name + ' on Google Maps.');
                    g.panMap(latLng);

                });
            }

            clearFocused();

            if(!obj.price) {
                obj.price = '';
            }

            if(obj.marker) {
                g.toggleBounce(obj.marker);
            } else {
                obj.marker = g.createMarker({
                    lat: a.coordinates.latitude,
                    lng: a.coordinates.longitude
                }, {
                    click: function() {
                        clickLocation(obj);
                        vm.closeMenu(false);
                        vm.showInfo(true);
                    }
                });
                g.toggleBounce(obj.marker);
            }

            if(!obj.reviewed) {
                y.getReviews(obj.id).done(function(data) {
                    obj.reviews = data.reviews;
                    obj.reviewed = true;
                    vm.focusedLocation(obj);

                }).fail(function() {
                    window.alert('Unable to retrieve reviews for ' + obj.name + '.');
                    obj.reviews = [];
                    vm.focusedLocation(obj);
                });
            } else {
                vm.focusedLocation(obj);
            }

            vm.showInfo(true);

        }

        function scrollLocation(data, e) {
            // if(!vm.fetching && vm.total() > vm.locations().length) {
            //     ele = e.target;
            //     if((ele.scrollTop + ele.offsetHeight) > (ele.scrollHeight - 100)) {
            //         search();
            //     }
            // }
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
                params.term = vm.keyword().replace(/\s/g, '').toUpperCase();
            }
            return params;
        }

        function clearLocations() {
            vm.locations().forEach(function(b) {
                b.marker.setMap(null);
            });
            vm.locations.removeAll();
        }

        function search() {
            y.search().done(function(data) {
                data.businesses = data.businesses.map(function(a) {
                    a.marker = g.createMarker({
                        lat: a.coordinates.latitude,
                        lng: a.coordinates.longitude
                    }, {
                        click: function() {
                            clickLocation(a);
                            vm.closeMenu(false);
                            vm.showInfo(true);
                        }
                    });
                    return a;
                });
                Object.keys(data.categoryHeaders).forEach(function(c) {
                    vm.optionsFilters.push(data.categoryHeaders[c]);
                });
                // vm.optionsFilters(data.categoryHeaders) = vm.optionsFilters(data.categoryHeaders);
                var a;
                g.extendBounds(data.businesses.map(function(b) {
                    vm.locations.push(b);
                    vm.allLocations.push(b);
                    return b.coordinates;
                }));
                g.mapClearIdleListeners();

            }).fail(function() {
                window.alert("Status 500. Unable to get locations.");

            });
        }

        function hideInfo() {
            clearFocused();
        }

        function getStarRatings(rating, isSmall) {
            var s = 'dist/small';
            var i = Math.floor(rating);
            var r = rating % 1;
            s += '_'+i;
            if(i > 0 && r > 0) {
                s += '_half';
            }
            if(!isSmall) {
                s += '@2x';
            }
            return s + '.png';
        }

        function clearFocused() {
            // g.removeFocused();
            if(vm.focusedLocation().marker) {
                g.toggleBounce(vm.focusedLocation().marker);
            }
            vm.showInfo(false);
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

        function filterLocation() {
            var filterOutFunc;
            if(vm.selectedFilter() && vm.keyword().trim().length > 0) {
                filterOutFunc = function(a) {
                    return a.name.toLowerCase().indexOf(vm.keyword().toLowerCase()) == -1 || a.parentCategories.find(function(b) {
                        return b.alias != vm.selectedFilter().alias;
                    });
                };

            } else if(vm.selectedFilter()) {
                filterOutFunc = function(a) {
                    return a.parentCategories.find(function(b) {
                        return b.alias != vm.selectedFilter().alias;
                    });
                };
            } else if(vm.keyword().trim().length > 0) {
                filterOutFunc = function(a) {
                    return a.name.toLowerCase().indexOf(vm.keyword().toLowerCase()) == -1;
                };
            }

            vm.locations.removeAll();
            vm.allLocations().forEach(function(location) {
                g.addMarker(location.marker);
                vm.locations.push(location);
            });

            if(filterOutFunc) {
                vm.locations.remove(filterOutFunc).forEach(function(location) {
                    g.removeMarker(location.marker);
                });
            }
        }

    }

});
