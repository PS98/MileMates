﻿"use strict";

angular.module("psApp").config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

        var routes = [
             {
                 state: "home",
                 config: {
                     url: "/",
                     controller: "indexController",
                     template: "<ps-index></ps-index>"
                 }
             },
               {
                   state: "Contact",
                   config: {
                       url: "/Contact",
                       template: "<ps-contact-us></ps-contact-us>"
                   }
               },
                {
                    state: "About",
                    config: {
                        url: "/About",
                        template: "<ps-about-us></ps-about-us>"
                    }
                },
                {
                    state: "Dashboard",
                    config: {
                        url: "/Dashboard",
                        template: "<ps-dashboard></ps-dashboard>"
                    }
                },
                {
                    state: "Terms",
                    config: {
                        url: "/Terms",
                        template: "<ps-terms></ps-terms>"
                    }
                },
                {
                    state: "PrivacyPolicy",
                    config: {
                        url: "/PrivacyPolicy",
                        template: "<ps-privacy-policy></ps-privacy-policy>"
                    }
                },
               {
                   state: "service",
                   config: {
                       url: "/Service",
                       template: "<car-service></car-service>"
                   }
               },
               {
                   state: "service.car",
                   config: {
                       url: "/",
                       template: "<select-car></select-car>"
                   }
               },
                 {
                     state: "service.centre",
                     config: {
                         url: "/",
                         template: "<select-centre></select-centre>"
                     }
                 },
                 {
                     state: "service.appointment",
                     config: {
                         url: "/",
                         template: "<book-appointment></book-appointment>"
                     }
                 },
               {
                   state: "service.address",
                   config: {
                       url: "/",
                       template: "<select-address></select-address>"
                   }
               },
                  
               {
                   state: "socialCallback",
                   config: {
                       url: "/Auth/Success",
                       template: "<div id='page-preloader'><img class='spinner' src='../assets/img/cool-loading-animated.gif' alt='MileMates'></div>",                      
                        controller: "loginDetailsController"
                 }
            }
        ];

        routes.forEach(function (route) {
            $stateProvider.state(route.state, route.config);
        });


        $urlRouterProvider.otherwise('/');

        //TODO: don't forget to configure iis settings for html5 mode angular when deploying the code
        $locationProvider.html5Mode(true);

    }]);