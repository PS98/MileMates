﻿"use strict";

angular.module("index").directive("latestOffers", function () {
    return {
        //Not defining the scope because now we want the inherited scope(default scope for angular) for psDashboard 
        //instead of isolated scope
        templateUrl: "ext-modules/index/latestOffersTemplate.html",
        //controller: "indexController",
        link: function (scope, el, attrs) {
            new WOW().init();
        }
    };
});

