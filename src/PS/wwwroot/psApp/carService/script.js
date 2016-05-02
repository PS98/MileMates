
var placeSearch, autocomplete, autocomplete_textarea, googleMapHolder, map, googleMapMarkers = [], displayCurrentLocation, latlon, userLocation = {}, locationCall, draggable;
var infowindow = google.maps ? new google.maps.InfoWindow() : "";
var geocoder = google.maps ? new google.maps.Geocoder(): "";

var componentForm = {
    //street_number: 'short_name',
    //premise: "short_name",
    //route: 'long_name',
    sublocality_level_1: "short_name",
    sublocality_level_2: "short_name",
    administrative_area_level_2: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

var mapOptions = {
    center: latlon,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
}


function initializeGoogleMap(textBoxId, mapHolderId, autocompleteCallback, currentLocation, locationCallBack, candrag) {
    googleMapHolder = "";
    googleMapHolder = mapHolderId;
    displayCurrentLocation = currentLocation;
    locationCall = locationCallBack;
    if (textBoxId !== "") {
        autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById(textBoxId)),
        { types: ['geocode'] });
        if (autocompleteCallback != "")
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                autocompleteCallback(autocomplete);
            });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, handleError);
    } else {
        error('Google Map is not supported');
    }
    if (candrag) {
        draggable = candrag;
    } else {
        draggable = false;
    }
    return autocomplete;
}

function showMap(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    latlon = new google.maps.LatLng(lat, lon);
    // var mapholder = document.getElementById(googleMapHolder);
    //mapholder.style.height = "200px";
    //mapholder.style.width = "500px";
    mapOptions.center = latlon;
    locateCityAndArea(latlon);
    if (displayCurrentLocation) {
        mapOptions.zoom = 16;
    }
    map = new google.maps.Map(document.getElementById(googleMapHolder), mapOptions);

    if (displayCurrentLocation) {
        var marker = new google.maps.Marker({ position: latlon, map: map, title: "You are here!", draggable: draggable });
        infowindow.setContent("You are here!");
        infowindow.open(map, marker);
        if (draggable) {
            google.maps.event.addListener(marker, 'drag', function () {
                // document.getElementById('lat').value = marker.position.lat();
                //document.getElementById('lng').value = marker.position.lng();
                var latlong = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                locateCityAndArea(latlong);
            }
            );
        }
    }

}

function handleError(err) {
    //switch (err.code) {
    //    case error.PERMISSION_DENIED:
    //        x.innerHTML = "User denied the request for Geolocation.";
    ////    case error.POSITION_UNAVAILABLE:
    //        x.innerHTML = "Location information is unavailable.";
    //        break;
    //    case error.TIMEOUT:
    //        x.innerHTML = "The request to get user location timed out.";
    //        break;
    //    case error.UNKNOWN_ERROR:
    //        x.innerHTML = "An unknown error occurred.";
    //        break;
    //}        break;

    getLatLng('India');

}
function loadMap(lat, lng, zoom) {
    if (!zoom)
        zoom = 4;
    latlon = new google.maps.LatLng(lat, lng);
    mapOptions.center = latlon;
    mapOptions.zoom = zoom;
    map = new google.maps.Map(document.getElementById(googleMapHolder), mapOptions);
}

function loadCurrentLocation(city, area) {
    if (locationCall)
        locationCall(city.long_name, area.long_name);

}
function locateCityAndArea(latlng) {

    var geoType = { 'latLng': latlng };

    callGeoCoderApi(geoType).then(function (data) {
        loadCurrentLocation(data.city, data.area);
    });

    //return { city: result.city, area: result.area };
}

function getLatLng(place, zoom) {
    var address = { 'address': place };

    callGeoCoderApi(address).then(function (data) {
        loadMap(data.lat, data.lng, zoom);
    });

    //return { lat: result.lat, lng: result.lng };

}

function callGeoCoderApi(type) {
    var city, area, lat, lng;
    var defer = new $.Deferred();
    geocoder.geocode(type, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                    for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                        if (results[0].address_components[i].types[b] == "sublocality_level_1") {
                            area = results[0].address_components[i];

                        }

                        if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                            city = results[0].address_components[i];
                            break;
                        }
                    }
                }
                if (draggable)
                    fillInAddressToTextBox(results[0].address_components, results[0].formatted_address);
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                var obj = { city: city, area: area, lat: lat, lng: lng };
                defer.resolve(obj);

            } else {
                alert("No results found");
                defer.reject();
            }
        } else {
            // alert("Geocoder failed due to: " + status);
            defer.reject();
        }

    });
    return defer.promise();

}

function fillInAddress(autocomplete) {
    var place = autocomplete.getPlace();
    console.log(place.geometry.location.lng());
    for (var component in componentForm) {
        document.getElementById(component).value = '';
        if (component != "administrative_area_level_2" && component != "administrative_area_level_1" && component != "country" && component != "postal_code")
        {
            document.getElementById(component).disabled = false;
        }        
        fillInAddressToTextBox(place.address_components);
    }
}

function fillInAddressToTextBox(addressComponents, formatted_address) {
    for (var i = 0; i < addressComponents.length; i++) {
        var addressType = addressComponents[i].types[0];
        if (componentForm[addressType]) {
            var val = addressComponents[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
    if (document.getElementById("formatted_address") && formatted_address)
        document.getElementById("formatted_address").value = formatted_address;
}

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = new google.maps.LatLng(
                position.coords.latitude, position.coords.longitude);
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}


function setMarkers(googleMap, locations, callback) {
    if (googleMap)
        map = googleMap;
    var latlngset, markers = [];
    googleMapMarkers = [];
    var bounds = new google.maps.LatLngBounds();
    infowindow.close();
    $.each(locations, function (index, val) {

        //var lat = val.latitude;
        //var long = val.longitute;


        var lat = val.longitude;
        var long = val.latitude;
        latlngset = new google.maps.LatLng(lat, long);

        var marker = new google.maps.Marker({
            map: map,
            position: latlngset
        });
        //  map.setCenter(marker.getPosition());
        marker.setMap(map)

        var content = val.name;

        bounds.extend(marker.position);

        google.maps.event.addListener(marker, 'click', (function (marker, infowindow, callback, val) {
            return function () {
                infowindow.setContent(val.name);
                infowindow.open(map, marker);
                callback(val);
            };
        })(marker, infowindow, callback, val));
        if (val.activeCentre) {
            infowindow.open(map, marker);
            infowindow.setContent(content);
        }

        googleMapMarkers.push(marker);

    });

    map.fitBounds(bounds);
}
function myClick(id, markersLocations) {
    var mapMarkerIndex;


    $.each(markersLocations, function (index, val) {

        if (val.$$hashKey == id) {
            mapMarkerIndex = index;
        }
    });
    google.maps.event.trigger(googleMapMarkers[mapMarkerIndex], 'click');
}
function removeMarker() {

    for (var i = 0; i < googleMapMarkers.length; i++) {
        googleMapMarkers[i].setMap(null);
    }
    googleMapMarkers = [];
}
