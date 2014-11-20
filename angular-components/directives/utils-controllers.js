/**
 * Created with PyCharm.
 * User: M. Raza Dar
 * Date: 8/29/14
 * Time: 12:16 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module('tcApp.utils', ['tcApp.utils.directives'])
    .controller('DropdownCtrl', ['$scope', function DropdownCtrl($scope) {
        $scope.is_open = false;
    }]).controller('RatingCtrl', ['$scope', function($scope){
        $scope.rate = 3;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];
    }]).controller('PaginationDemoCtrl', ['$scope', function ($scope) {
        $scope.totalItems = 64;
        $scope.currentPage = 4;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;
    } ]).controller('AlertDemoCtrl', ['$rootScope', '$scope', function AlertDemoCtrl($rootScope, $scope) {
        /*$rootScope.app_alerts = [
         { type: 'danger', msg: 'Well done! You successfully read this important alert message.' },
         { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
         ];*/
        $scope.closeAlert = function(index) {
            $rootScope.app_alerts.splice(index, 1);
        };
        $scope.$watch("app_alerts", function(old_val, new_val){
            if(new_val.length !== old_val.length){
                setTimeout(function(){
                    $rootScope.app_alerts.splice(0, 1);
                    $scope.checkApply();
                }, 5000);
            }
        }, true);
    }]).controller('DatePickerCtrl', ['$scope', '$timeout', function DatePickerCtrl($scope, $timeout){
        $scope.bools={
            show_weeks : false,
            show_buttons : false
        };
        $scope.open = function() {
            $timeout(function() {
                $scope.opened = !$scope.opened ;
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            });
        };
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };
        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
    }]).controller('TimePickerCtrl', ["$scope", function TimePickerCtrl($scope) {
        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };
    }]);