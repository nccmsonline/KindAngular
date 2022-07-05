angular
.module('printLandscapeModule', [])
.controller('printLandscapeCtrl', function ($scope) {

    $scope.printInLandscape = function(){        
        window.print(); }
});