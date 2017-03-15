define([
    "jquery"
], function($) {
    "use strict";

    // Data latest update: June 30, 2014
    // Reason: Funding request not granted.
    // Source: https://www.broadbandmap.gov/about

    function getHeaders(callback, errCallback) {
        $.ajax({
            url: "https://www.broadbandmap.gov/broadbandmap/api/dictionary/v1/demographics?format=json",
            method: "GET",
            success: callback,
            error: errCallback
        });
    }

    function getDemographics(request, callback, errCallback) {
        $.ajax({
            url: "https://www.broadbandmap.gov/broadbandmap/demographic/2014/coordinates",
            method: "GET",
            success: callback,
            error: errCallback,
            data: request
        });
    }

    return {
        getHeaders: getHeaders,
        getDemographics: getDemographics
    };

});
