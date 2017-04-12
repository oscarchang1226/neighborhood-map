define([
    'knockout'
], function(ko) {
    'use strict';

    function OptionsFilter(label, value) {
        this.label = label;
        this.value = value;
    }

    return {
        OptionsFilter: OptionsFilter
    };
});
