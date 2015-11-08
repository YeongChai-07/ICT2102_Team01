'use strict';

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope','$mdDialog', '$stateParams', '$location', 'Authentication', 'Reports',
	function($scope,$mdDialog, $stateParams, $location, Authentication, Reports) {
		$scope.authentication = Authentication;

		// Create new Report
		$scope.create = function() {
			// Create new Report object
			var report = new Reports ({
				roadname: this.roadname,
				category:this.data.category,
				congestion:this.data.congestion,
				time:this.time,
				upvotes:this.upvotes,
				downvotes:this.downvotes
			});


			// Redirect after save
			report.$save(function(response) {
				//$location.path('/#!/');
				//$scope.message = "Saved successfully!!!";
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#mainPage')))
						.clickOutsideToClose(true)
						.title('Thank you for contributing!')
						.content('Your traffic congestion report was saved successfully!')
						.ok('Alright!')
						.targetEvent()
				);
				if($location.path()!='/#!/'){
					setTimeout(function () {
						window.location.href = "/#!/";
					}, 2000);
				}
				// Clear form fields
				$scope.roadname = '',
					$scope.category = '',
					$scope.congestion = '',
					$scope.time = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Remove existing Report
		$scope.remove = function(report) {
			if ( report ) {
				report.$remove();

				for (var i in $scope.reports) {
					if ($scope.reports [i] === report) {
						$scope.reports.splice(i, 1);
					}
				}
			} else {
				$scope.report.$remove(function() {
					$location.path('reports');
				});
			}
		};

		// Update existing Report
		$scope.update = function() {
			var report = $scope.report;

			report.$update(function() {
				$location.path('reports/' + report._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reports
		$scope.find = function() {
			$scope.reports = Reports.query();
		};

		// Find existing Report
		$scope.findOne = function() {
			$scope.report = Reports.get({
				reportId: $stateParams.reportId
			});
		};

		$scope.incrementUpvotes = function(report) {
			report.upvotes += 1;
			report.$update(function() {
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#mainPage')))
						.clickOutsideToClose(true)
						.title('Thank you for contributing!')
						.content('Your vote has been saved!')
						.ok('Alright!')
						.targetEvent()
				);
			}, function(errorResponse) {
				alert("Voting failed");
			});
		};

		$scope.incrementDownvotes = function(report) {
			report.downvotes -= 1;
			report.$update(function() {
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#mainPage')))
						.clickOutsideToClose(true)
						.title('Thank you for contributing!')
						.content('Your vote has been saved!')
						.ok('Alright!')
						.targetEvent()
				);
			}, function(errorResponse) {
				alert("Voting failed");
			});
		};

	}
]);
