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
        $scope.goToSteps = function(){
            $location.hash('routeInstruction');
            $anchorScroll();
        };
        //Scroll to Route directions at the bottom of page
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
        $scope.toggleCollapsed = {collapsed:1,buttonCollapsed:1};
        $scope.data = {vehicles:'any'};

        $scope.routeToLocation = function(location,endingpoint) {
            var vehiclesInRoute1 = [];
            var vehiclesInRoute2 = [];
            var vehiclesInRoute3 = [];
            var vehiclesInRoute4 = [];

            var transportType1='';
            var transportType2='';
            var transportType3='';
            var transportType4='';

            var routeDataStruct = [];
            $scope.routeButtons = routeDataStruct;

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
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap($scope.map);
                    directionsDisplay.setPanel(document.getElementById('routeInstruction'));
                    //$scope.toggleCollapsed.buttonCollapsed = 0;
                    var collapsedAttribute = [];
                    console.log(response.routes[0].legs[0].steps.length);
                    for(var j=0;j<4;j++){
                        for(var i=0;i<response.routes[j].legs[0].steps.length;i++){
                            if(response.routes[j].legs[0].steps[i].travel_mode!="WALKING"){
                                if(j==0){
                                    vehiclesInRoute1.push(response.routes[j].legs[0].steps[i].transit.line.vehicle.name);
                                }
                                else if(j==1){
                                    vehiclesInRoute2.push(response.routes[j].legs[0].steps[i].transit.line.vehicle.name);
                                }
                                else if(j==2){
                                    vehiclesInRoute3.push(response.routes[j].legs[0].steps[i].transit.line.vehicle.name);
                                }
                                else{
                                    vehiclesInRoute4.push(response.routes[j].legs[0].steps[i].transit.line.vehicle.name);
                                }
                            }
                        }
                    }
                    //Determining transport type for each routes
                    if(vehiclesInRoute1.indexOf("Subway")==-1 && vehiclesInRoute1.indexOf("Bus")==-1){
                        transportType1 = 'Walk there!';
                    }
                    else if(vehiclesInRoute1.indexOf("Bus")==-1){
                        transportType1 = 'Train only';
                    }
                    else if(vehiclesInRoute1.indexOf("Bus")!=-1 && vehiclesInRoute1.indexOf("Subway")!=-1){
                        transportType1 = 'Bus and Train';
                    }
                    else if(vehiclesInRoute1.indexOf("Subway")==-1){
                        transportType1 = 'Bus only';
                    }
                    if(vehiclesInRoute2.indexOf("Subway")==-1 && vehiclesInRoute2.indexOf("Bus")==-1){
                        transportType2 = 'Walk there!';
                    }
                    else if(vehiclesInRoute2.indexOf("Bus")==-1){
                        transportType2 = 'Train only';
                    }
                    else if(vehiclesInRoute2.indexOf("Bus")!=-1 && vehiclesInRoute2.indexOf("Subway")!=-1){
                        transportType2 = 'Bus and Train';
                    }
                    else if(vehiclesInRoute2.indexOf("Subway")==-1){
                        transportType2 = 'Bus only';
                    }
                    if(vehiclesInRoute3.indexOf("Subway")==-1 && vehiclesInRoute3.indexOf("Bus")==-1){
                        transportType3 = 'Walk there!';
                    }
                    else if(vehiclesInRoute3.indexOf("Bus")==-1){
                        transportType3 = 'Train only';
                    }
                    else if(vehiclesInRoute3.indexOf("Bus")!=-1 && vehiclesInRoute3.indexOf("Subway")!=-1){
                        transportType3 = 'Bus and Train';
                    }
                    else if(vehiclesInRoute3.indexOf("Subway")==-1){
                        transportType3 = 'Bus only';
                    }
                    if(vehiclesInRoute4.indexOf("Subway")==-1 && vehiclesInRoute4.indexOf("Bus")==-1){
                        transportType4 = 'Walk there!';
                    }
                    else if(vehiclesInRoute4.indexOf("Bus")==-1){
                        transportType4 = 'Train only';
                    }
                    else if(vehiclesInRoute4.indexOf("Bus")!=-1 && vehiclesInRoute4.indexOf("Subway")!=-1){
                        transportType4 = 'Bus and Train';
                    }
                    else if(vehiclesInRoute4.indexOf("Subway")==-1){
                        transportType4 = 'Bus only';
                    }
                    //Save the current instance of response (DirectionsResult) to $scope
                    // for use in later of the code
                    $scope.directionsResult = response;

                    for(var count=0;count<response.routes.length;count++)
                    {
                        // Initialize buttonCollapsed to 0 (FALSE) and collapsed to 1 (TRUE)
                        collapsedAttribute.push({buttonCollapsed: 0,
                            collapsed: 1});
                        if(count==0){
                            routeDataStruct.push({routeID: (count),
                                routeDistance: ((response.routes[count].legs[0].distance.value)/1000).toFixed(0) + " km ",
                                routeDuration: ((response.routes[count].legs[0].duration.value)/60).toFixed(0) + " minutes ",
                                transportType: transportType1,
                                buttonCollapsedAttr: "toggleCollapsed.buttonCollapsed[" + count + "]",
                                clickCollapsed: "toggleCollapsed.collapsed[" + count + "]=!toggleCollapsed.collapsed[" + count + "]",
                                divCollapsedAttr: "toggleCollapsed.collapsed[" + count + "]",
                                divInstructionID: "routeInstruction" + count});
                        }
                        else if(count==1){
                            routeDataStruct.push({routeID: (count),
                                routeDistance: ((response.routes[count].legs[0].distance.value)/1000).toFixed(0) + " km ",
                                routeDuration: ((response.routes[count].legs[0].duration.value)/60).toFixed(0) + " minutes ",
                                transportType: transportType2,
                                buttonCollapsedAttr: "toggleCollapsed.buttonCollapsed[" + count + "]",
                                clickCollapsed: "toggleCollapsed.collapsed[" + count + "]=!toggleCollapsed.collapsed[" + count + "]",
                                divCollapsedAttr: "toggleCollapsed.collapsed[" + count + "]",
                                divInstructionID: "routeInstruction" + count});
                        }
                        else if(count==2){
                            routeDataStruct.push({routeID: (count),
                                routeDistance: ((response.routes[count].legs[0].distance.value)/1000).toFixed(0) + " km ",
                                routeDuration: ((response.routes[count].legs[0].duration.value)/60).toFixed(0) + " minutes ",
                                transportType: transportType3,
                                buttonCollapsedAttr: "toggleCollapsed.buttonCollapsed[" + count + "]",
                                clickCollapsed: "toggleCollapsed.collapsed[" + count + "]=!toggleCollapsed.collapsed[" + count + "]",
                                divCollapsedAttr: "toggleCollapsed.collapsed[" + count + "]",
                                divInstructionID: "routeInstruction" + count});
                        }
                        else if(count==3){
                            routeDataStruct.push({routeID: (count),
                                routeDistance: ((response.routes[count].legs[0].distance.value)/1000).toFixed(0) + " km ",
                                routeDuration: ((response.routes[count].legs[0].duration.value)/60).toFixed(0) + " minutes ",
                                transportType: transportType4,
                                buttonCollapsedAttr: "toggleCollapsed.buttonCollapsed[" + count + "]",
                                clickCollapsed: "toggleCollapsed.collapsed[" + count + "]=!toggleCollapsed.collapsed[" + count + "]",
                                divCollapsedAttr: "toggleCollapsed.collapsed[" + count + "]",
                                divInstructionID: "routeInstruction" + count});
                        }
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
            directionsDisplay.setRouteIndex(index);
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap($scope.map);
            directionsDisplay.setPanel(document.getElementById('routeInstruction'));
        }
    } // end of controller function
]);
})(window.angular);
