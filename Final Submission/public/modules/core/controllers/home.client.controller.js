'use strict';

(function(angular) {
angular.module('core').controller('HomeController', ['$scope', 'Authentication','$anchorScroll',
    'usersService', '$mdSidenav', '$mdBottomSheet', '$log',
    function($scope, Authentication,$anchorScroll, usersService, $mdSidenav, $mdBottomSheet, $log) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.reloadPage = function(){window.location.reload();}

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
]).controller("GMapController", ['$scope','$mdDialog','$anchorScroll',
    function($scope,$mdDialog,$anchorScroll){
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
        var rendererOptions = {
            hideRouteList: true
        };
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        var directionsService = new google.maps.DirectionsService;

        /*
         Now we will define the function which is executed once the user clicks the submit button after entering a location
         The function will geocode the location, i.e. find its latitude and longitude
         Then it will display a marker on the map corresponding to the location
         The function has a parameter, which is the location entered by the user
         */

        /* Route and display function found at Google Map API */
        //$scope.toggleCollapsed = {collapsed:1,buttonCollapsed:1};
        $scope.data = {vehicles:'any'};

        $scope.routeToLocation = function(location,endingpoint) {
            directionsDisplay.setDirections({routes: []});
            if($scope.data.vehicles=='bus'){
                var request = {
                    origin: location,
                    destination: endingpoint,
                    region: 'SG',
                    travelMode: google.maps.TravelMode.TRANSIT
                    ,transitOptions: {modes:[google.maps.TransitMode.BUS]},
                    provideRouteAlternatives: true
                };
            }
            else if($scope.data.vehicles=='train'){
                var request = {
                    origin: location,
                    destination: endingpoint,
                    region: 'SG',
                    travelMode: google.maps.TravelMode.TRANSIT
                    ,transitOptions: {modes:[google.maps.TransitMode.TRAIN]},
                    provideRouteAlternatives: true
                };
        }
            else{ //If no preference:
                var request = {
                    origin: location,
                    destination: endingpoint,
                    region: 'SG',
                    travelMode: google.maps.TravelMode.TRANSIT,
                    provideRouteAlternatives: true
                };
            }
            //console.log(request);
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    console.log(response);
                    var collapsedAttribute = [];
                    console.log(response.routes[0].legs[0].steps.length);
					var vehiclesInRoute = [];
                    for(var i=0;i<response.routes[0].legs[0].steps.length;i++){
                        if(response.routes[0].legs[0].steps[i].travel_mode!="WALKING"){
                            vehiclesInRoute.push(response.routes[0].legs[0].steps[i].transit.line.vehicle.name);
                        }
					}
					
                    //Save the current instance of response (DirectionsResult) to $scope
                    // for use in later of the code
                    $scope.directionsResult = response;

					var routeDataStruct = [];
                    for(var count=0;count<response.routes.length;count++)
                    {
						 // Initialize buttonCollapsed to 0 (FALSE) and collapsed to 1 (TRUE)
                        collapsedAttribute.push({buttonCollapsed: 0,
                            collapsed: 1});
                        routeDataStruct.push({routeID: (count),
                            routeDistance: ((response.routes[count].legs[0].distance.value)/1000).toFixed(0) + " km ",
                            routeDuration: ((response.routes[count].legs[0].duration.value)/60).toFixed(0) + " minutes ",
                            buttonCollapsedAttr: "toggleCollapsed[" + count + "].buttonCollapsed",
                            clickCollapsed: "redisplayRoute(" + count  + ")",
                            divCollapsedAttr: "toggleCollapsed[" + count + "].collapsed",
                            divInstructionID: "routeInstruction" + count});
                    }

                    $scope.routeButtons = routeDataStruct;
                    $scope.toggleCollapsed = collapsedAttribute;

                }
                else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#mainPage')))
                            .clickOutsideToClose(true)
                            .title('No directions found!')
                            .content('Please try again either with more specific location inputs, postal codes or removing certain filters.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent()
                    );
                    //alert("We were unable to find any directions.\nPlease try again with more specific location inputs, postal codes or removing certain filters.\nERR_MSG:"+ status);
                }
            });
        } // end of routeToLocation function

        $scope.redisplayRoute = function(index){
			// Code logic to control on the ng-hide goes here
			$scope.toggleCollapsed[index].collapsed=! $scope.toggleCollapsed[index].collapsed;
			
            directionsDisplay.setDirections($scope.directionsResult);
			directionsDisplay.setRouteIndex(index);
            directionsDisplay.setMap($scope.map);
            directionsDisplay.setPanel(document.getElementById('routeInstruction' + index));
        }
    } // end of controller function
]);
})(window.angular);
