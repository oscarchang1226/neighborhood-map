define([
    "knockout"
], function(ko) {
    "use strict";

    function Location(obj) {
        this.placeId = ko.observable(obj.placeId || 0);
        this.name = ko.observable(obj.name || "");
        this.latlng = ko.observable(obj.latlng || {});
    }

    return {
        Location: Location
    };

});
