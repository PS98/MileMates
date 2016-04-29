﻿"use strict";

angular.module("psApp").directive("selectAddress", function () {
    return {
        templateUrl: "psApp/carService/selectAddress.html",
        link: function (scope, element, attrs) {           
            var autocomplete
            scope.showMap = function () {
                if (!autocomplete)
                    autocomplete = initializeGoogleMap('formatted_address', 'googleMap', setAutocomplete, true, undefined, true);
            }
            function setAutocomplete(auto) {
             //  autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocompleteTextBox')), { types: ['geocode'] });
               //google.maps.event.addListener(autocomplete, 'place_changed', function () {


              // autocomplete = auto;
                 var place = autocomplete.getPlace();
                 var lat = place.geometry.location.lat();
                 var lon = place.geometry.location.lng();
                  var latlon = new google.maps.LatLng(lat, lon);
             var mapholder = document.getElementById('googleMap');
           //  mapholder.style.height = "200px";
             //mapholder.style.width = "500px";

             fillInAddress(autocomplete);
             var myOptions = {
                 center: latlon, zoom: 14,
                 mapTypeId: google.maps.MapTypeId.ROADMAP,
                 mapTypeControl: false,
                 navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
             }

             var map = new google.maps.Map(document.getElementById("googleMap"), myOptions);
             var marker = new google.maps.Marker({ position: latlon, map: map, title: place.name });
             var infowindow = new google.maps.InfoWindow({
                 content: place.name
             });

             infowindow.open(map, marker);


             //});

            
           }

            element.delegate('#autocompleteTextBox', 'focus', function geolocates() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var geolocation = new google.maps.LatLng(
                            position.coords.latitude, position.coords.longitude);
                        var circle = new google.maps.Circle({
                            center: geolocation,
                            radius: position.coords.accuracy
                        });
                        autocomplete.setBounds(circle.getBounds());
                    });
                }
            });
        },
        controller: ["$scope", "$window","$state", "$localStorage", "psDataServices", function ($scope, $window,$state, $localStorage, psDataServices) {
            $scope.payNow = true;           
            $scope.oldNumber = $localStorage.userDetails.phoneNo;
            $scope.checkMobileNumber = function () {               
                if ($localStorage.userDetails.phoneNo == $scope.oldNumber) {
                    $('.mobile_validation').hide();
                }
            }

            $scope.orderProcess = function () {
                if ($scope.payNow) {
                    psDataServices.setPaymentMode("Online");
                    $scope.response = psDataServices.payment("test_user", "testing", "10", "varshneyshobhit98@yahoo.com", "+918380911266", "true", "true").then(function (result) {
                        //Success
                        if (result.status == 0) {
                            if (result.result != null) {
                                $window.location.href = result.result.payment_request.longurl;
                            }
                        } else if (result.status == 1 || result.status == 2) {
                            $scope.reqError = true;
                            $scope.errorMessage = result.message;
                        }
                    }, function (error) {
                        //Error
                    }).finally(function () {
                    });
                }
                else {
                   psDataServices.setPaymentMode("COD");
                   psDataServices.submitOrder().success(function () {
                        $state.go("orderSuccess");
                    }).error(function () {
                        alert('error');
                    })
                }
            }
             
        }

        ]
    }
});