﻿angular.module("psApp").controller("carServiceController", ["$scope", "$state","$timeout", "psDataServices", function ($scope, $state,$timeout, psDataServices) {

    $scope.center = {};
    $scope.searchedText = {};    $scope.state = $state;
    var custRequest = {name: " Describe your problem here", type: [], addText: true }
    $scope.showBrandName = true; $scope.showMakeYears = false; $scope.showModel = false; $scope.selectedCar = {};// $scope.selectedCar = { brandName: '', model: '', year:'',varient:'' };
    $scope.car = {}; $scope.serviceOpts = {}; $scope.selectedJob = [];
    $scope.carList = {};
    $scope.selectBrand = function (brandName) {
        $scope.showBrandName = false; $scope.showMakeYears = true; $scope.showModel = false; $scope.showVarient = false;
        if ($scope.selectedCar.brand != brandName) {
            $scope.selectedCar = {};
            $scope.carList.carTypes = {};
            $scope.carList.carVarientList = {};
            $scope.selectedCar.brand = brandName;
            psDataServices.getCarType(brandName).
             success(function (data) {
                 $scope.carList.carTypes = data;
             }).error(function () {
             });
        }
    }
    $scope.selectYear = function (year) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = true; $scope.showVarient = false;
        if (year !== "")
            $scope.selectedCar.year = year;
        else {
            $scope.selectedCar.year = "I Don't Know";
        }
    }
    $scope.selectModel = function (model) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false;
        if (model !== "") {
            $scope.selectedCar.model = model;
            $scope.selectedCar.varient = '';
            psDataServices.getCarVarient($scope.selectedCar.brand, model).
                    success(function (data) {
                        $scope.carList.carVarientList = data;
                        $scope.showVarient = true;
                    }).error(function () {
                        $scope.selectVarient("");
                    });

        } else {
            $scope.selectedCar.model = "I Don't Know";
            $scope.selectedCar.varient = "I Don't Know";

        }
      
    }
    $scope.selectVarient = function (varient) {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = false;
        if (varient !== "")
            $scope.selectedCar.varient = varient;
        else {
            $scope.selectedCar.varient = "I Don't Know";

        }
        $scope.car.choose_a_service = true; $scope.car.showServiceType = true;
        $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
    }
    $scope.editBrand = function () {
        $scope.showBrandName = !$scope.showBrandName; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = false;
        displayIncompleteModule();
    }
    $scope.editYear = function () {
        $scope.showBrandName = false; $scope.showMakeYears = !$scope.showMakeYears; $scope.showModel = false; $scope.showVarient = false;
        if (!$scope.showMakeYears) displayIncompleteModule();

    }
    $scope.editModel = function () {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = !$scope.showModel; $scope.showVarient = false;
        if (!$scope.showModel) displayIncompleteModule();

    }
    $scope.editVarient = function () {
        $scope.showBrandName = false; $scope.showMakeYears = false; $scope.showModel = false; $scope.showVarient = !$scope.showVarient;

    }


    $scope.commonServices = [];
    $scope.changeView = function (event) {
        if(this.service)
        $scope.serviceOpts.viewMode = this.service;
        else {
            $scope.serviceOpts.viewMode = "consultation";
        }
        $scope.commonServices = $scope.services.serviceDetails[$scope.services.serviceName.indexOf(this.service)];
      
        if ($scope.serviceOpts.viewMode === "consultation") {
            if (!$scope.selectedJob.includes(custRequest))
                $scope.selectedJob.push(custRequest);
         }
    }

    $scope.addSelectedJob = function (selectedJob) {
        if (($scope.serviceOpts.viewMode === "Common Services" || $scope.serviceOpts.viewMode === "Scheduled Maintenance") && !selectedJob.selected) {
            selectedJob.onlyOne = true;

            var jobToRemove = $scope.selectedJob.filter(function (job) {
                return job.onlyOne === true;
            });
          if(jobToRemove.length>0)
            $scope.deleteSelectedJob(jobToRemove[0]);

        }
        selectedJob.selected = !selectedJob.selected;
        if (!$scope.selectedJob.includes(selectedJob))
            $scope.selectedJob.push(selectedJob);
        else {
            $scope.selectedJob.splice($scope.selectedJob.indexOf(selectedJob), 1);
        }
    }
    $scope.deleteSelectedJob = function (deletedJob) {
        if ($scope.selectedJob.indexOf(deletedJob) > -1)
            $scope.selectedJob.splice($scope.selectedJob.indexOf(deletedJob), 1);
        deletedJob.selected = !deletedJob.selected;

        if ($scope.serviceOpts.viewMode === "consultation" && $scope.selectedJob.length === 0) {
            $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
            $scope.commonServices = $scope.services.serviceDetails[0];
        }
    }
    $scope.chooseAnswer = function (job,question, option) {
        if (!question.ans)
            question.ans = [];
        if (!question.ans.includes(option))
            question.ans.push(option);
        else {
            question.ans.splice(question.ans.indexOf(option), 1);
        }
    }
    function displayIncompleteModule() {
        if (!$scope.showBrandName) {
            $scope.showMakeYears = $scope.selectedCar.year == undefined ? true : false;
            if (!$scope.showMakeYears)
                $scope.showModel = $scope.selectedCar.model == undefined ? true : false;
            if (!$scope.showModel)
                $scope.showVarient = $scope.selectedCar.varient == undefined ? true : false;
        }

    }
    psDataServices.getAllCarColletion().
       success(function (data) {
           $scope.carList.carCollections = data.carList;
           $scope.carList.yearsList = data.yearsList;
           fetchServiceDetails();
        }).error(function () {
       });

    function fetchServiceDetails() {
        psDataServices.getAllService().
            success(function(data) {
                $scope.services = data;
                $scope.serviceOpts.viewMode = $scope.services.serviceName[0];
                $scope.commonServices = $scope.services.serviceDetails[0];
                $scope.car.services = [];
                $timeout(function() {
                    $.each($scope.services.serviceDetails, function(i, val) {
                        $.each(val, function(i, value) {
                            $scope.car.services.push(value);
                        });
                    });
                },200);
            }).error(function() {
            });
    }

    $scope.showDetails = function (types) {
        $scope.overlayData = types;
        $("#detailsModal").modal();

    }
    $scope.setUserJob = function() {
        var jobName = [];
        $.each($scope.selectedJob, function(index,value) {
            jobName.push(value.name);
        });
        psDataServices.setSelectedCarAndService($scope.selectedCar, jobName);
        $state.go("service.centre");
    }
    console.log($state.current.name);

    $state.go("service.car");
    $scope.state = $state;

    $scope.search = function() {
        if ($scope.searchedText.name && $scope.searchedText.name.length > 0) {
            $scope.commonServices = $scope.car.services;

        } else {
           $scope.commonServices = $scope.services.serviceDetails[0];  
        }

    }
}]);



