'use strict';

(function() {
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    'usersService', '$mdSidenav', '$mdBottomSheet', '$log',
    function($scope, Authentication, usersService, $mdSidenav, $mdBottomSheet, $log) {
        // This provides Authentication context.
        $scope.authentication = Authentication;


        /**
         * Main Controller for the Angular Material Starter App
         * @param $scope
         * @param $mdSidenav
         * @param avatarsService
         * @constructor
         */

            // Load all registered users

        usersService
            .loadAll()
            .then( function( users ) {
                self.users    = [].concat(users);
                self.selected = users[0];
            });

        // *********************************
        // Internal methods
        // *********************************

        /**
         * Hide or Show the 'left' sideNav area
         */
        function toggleUsersList() {
            $mdSidenav('left').toggle();
        }

        /**
         * Select the current avatars
         * @param menuId
         */
        function selectUser ( user ) {
            self.selected = angular.isNumber(user) ? $scope.users[user] : user;
            self.toggleList();
        }

        /**
         * Show the bottom sheet
         */
        function share($event) {
            var user = self.selected;

            /**
             * Bottom Sheet controller for the Avatar Actions
             */
            function UserSheetController( $mdBottomSheet ) {
                this.user = user;
                this.items = [
                    { name: 'Phone'       , icon: 'phone'       },
                    { name: 'Twitter'     , icon: 'twitter'     },
                    { name: 'Google+'     , icon: 'google_plus' },
                    { name: 'Hangout'     , icon: 'hangouts'    }
                ];
                this.performAction = function(action) {
                    $mdBottomSheet.hide(action);
                };
            }

            $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'modules/core/views/contactsheet.client.view.html',
                controller: [ '$mdBottomSheet', UserSheetController],
                controllerAs: 'vm',
                bindToController : true,
                targetEvent: $event
            }).then(function(clickedItem) {
                $log.debug( clickedItem.name + ' clicked!');
            });
        }

        var self = this;

        self.selected     = null;
        self.users        = [ ];
        self.selectUser   = selectUser;
        self.toggleList   = toggleUsersList;
        self.share        = share;


    }
]).controller("GMapController", GMapController);

    function GMapController($scope) {


        /*
         In order to display a map, we have to first declare a variable mapOptions.
         mapOptions will help us define many parameters related to the map
         There are two required options for every map: center and zoom.
         Here we set the zoom of the map
         Center is at Singapore, i.e. the map will be zoomed at Singapore.
         Type of map is initiated using mapTypeID, in this case we display a road map
         You can check for more options in this link
         https://developers.google.com/maps/documentation/javascript/examples/control-options
         */


        /*
         Remember in the HTML file we will display the map in the HTML node <div id = map>
         We get the reference to this node using document.getElementById
         We use the following piece of code to display a map in the HTML at the node <div id = map>
         Ideally an instance of the map object is created and the reference of the HTML node is passed with mapOptions
         */
        $scope.map = new google.maps.Map(document.getElementById("homeMap"));

        /*
         First we need to create a gecoder object.
         This will be used to convert a location into its location coordinates
         */
        var geocoder = new google.maps.Geocoder();

        /*
         Google API: To add routing display and service for map
         */
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var directionsService = new google.maps.DirectionsService;

        /*
         Now we will define the function which is executed once the user clicks the submit button after entering a location
         The function will geocode the location, i.e. find its latitude and longitude
         Then it will display a marker on the map corresponding to the location
         The function has a parameter, which is the location entered by the user
         */
        $scope.showLocation = function(location) {

            /*
             The following piece of code including if and else statement will remain the same for all geocoding applications
             First we will call the GOOGLE Api's geocode function.
             For any other application only the name of the parameter will change in the code, everything else remains same
             The function will return a status and the result
             */
            geocoder.geocode({
                'address': location
            }, function(results, status) {

                /*
                 We will first check if the status is OK
                 OK means the geocoder was able to find location coordinates for the entered location
                 if it is true then we will store the result in a variable, which in this case is values
                 Then we will center the map to that location, i.e. focus to the location
                 For any other application, all the code will remain same
                 */

                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.value = results[0].geometry.location
                    $scope.map.setCenter(results[0].geometry.location)


                    /*
                     Once we have recieved the geocodes, we have to display a marker at that position
                     We do so by creating a marker, with two parameters
                     map: i.e. where the marker will be displayed
                     position: the geocordinates on the map where the marker should be displayed
                     */
                    var infoWindow = new google.maps.InfoWindow();

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: results[0].geometry.location
                    });
                    marker.content = "Lat: " + results[0].geometry.location.lat() + " Long:" + results[0].geometry.location.lng();
                    google.maps.event.addListener(marker, 'click', function() {

                        infoWindow.setContent(marker.content);
                        infoWindow.open($scope.map, marker);
                    })
                } // end of if statement

                /*
                 If the status is not OK, ie. geocoder is not able to find the geocordinates
                 we will display a message to the user with the status, i.e. what has actually gone wrong
                 why geocoder is not able to find the geocordinates of the location.
                 */
                else {
                    alert("Geocode was not successful for the following reason: " + status);
                } // end of else statement


            }); // close the geocode function

        } // end of the showLocation function
        /* Route and display function found at Google Map API */
        $scope.toggleCollapsed = {collapsed:1,buttonCollapsed:1};
        $scope.data = {vehicles:'any'};

        $scope.routeToLocation = function(location,endingpoint) {
            directionsDisplay.setDirections({routes: []});
            var vehArray=[google.maps.TransitMode.TRAIN,google.maps.TransitMode.BUS];
            //if($scope.data.vehicles=='any'){
            //
            //}
            var request = {
                origin: location,
                destination: endingpoint,
                region: 'SG',
                travelMode: google.maps.TravelMode.TRANSIT
                //, transitOptions: {modes:vehArray}
            };
            //console.log(request);
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap($scope.map);
                    directionsDisplay.setPanel(document.getElementById('routeInstruction'));
                    $scope.toggleCollapsed.buttonCollapsed = 0;
                    document.getElementById('routeDistance').innerHTML = ((response.routes[0].legs[0].distance.value)/1000).toFixed(0) + " km";
                    document.getElementById('routeDuration').innerHTML = ((response.routes[0].legs[0].duration.value)/60).toFixed(0) + " minutes";
                    console.log(response.routes[0].legs[0].steps.length);
                    //console.log(response.routes[0].legs[0].steps[0].transit.line.vehicle);

                    for(var i=0;i<response.routes[0].legs[0].steps.length;i++){
                        if(response.routes[0].legs[0].steps[i].travel_mode!="WALKING"){
                            console.log(response.routes[0].legs[0].steps[i].transit.line.vehicle.name);
                        }
                    }

                }
                else {
                    alert("We were unable to find any directions.\nPlease try again with more specific location inputs, postal codes or removing certain filters.\nERR_MSG:"+ status);
                }
            });
        }
    }; // end of controller function
}());
