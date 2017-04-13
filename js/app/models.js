define([
    'knockout'
], function(ko) {
    'use strict';

    function OptionsFilter(alias, title, parents) {
        this.alias = alias;
        this.title = title;
        this.parents = parents;
    }

    return {
        OptionsFilter: OptionsFilter
    };
});
