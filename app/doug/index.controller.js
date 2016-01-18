(function () {
    'use strict';

    console.log("In IndexController");

    angular
        .module('app')
        .controller('Doug.IndexController', Controller);

    console.log("In IndexController");

    function Controller(UserService) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            console.log("In IndexController initController");
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
    }

})();