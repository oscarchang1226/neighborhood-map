define([
    "knockout",
    "models/models"
], function(ko, models) {
    "use strict";

    function ViewModel(locations) {
        var vm = this;

        vm.locations = ko.observableArray();
        vm.setLocations = setLocations;

        if(Array.isArray(locations)) {
            vm.setLocations(locations);
        }

        function setLocations(locations) {
            console.log(locations);
        }
    }

    return ViewModel;

});
