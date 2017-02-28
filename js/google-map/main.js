define([
    "knockout",
    "google-map/viewmodel",
    "text!google-map/template.html"
], function(ko, ViewModel, template){
    "use strict";

    return {
        viewModel: ViewModel,
        template: template
    };
});
