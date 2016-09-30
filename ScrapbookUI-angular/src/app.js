// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { walk } from './hello_world/hello_world'; // code authored by you in this project
import env from './env';

console.log('Loaded environment variables:', env);

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());
window.$ = window.jQuery = require('../app/js/jquery.min.js');

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);

document.addEventListener('DOMContentLoaded', function () {    
	// walk('C:\\Users\\csingh\\Downloads\\Team Outing', function(err, results) {
	// 	console.log(err);
	// 	console.log(results);
 //    	// document.getElementById('display1').innerHTML = results;
 //    	$(results).each(function(index,val){
 //    		$('#display1').append("<img src='"+ val +"' class='image_thumbnail'>");
 //    	});
 //    });
    // document.getElementById('platform-info').innerHTML = os.platform();
    // document.getElementById('env-name').innerHTML = env.name;
});

var fs = require('fs');

$(function(){

	angular.module("myApp",[]).controller('maincontroller',['$scope','$timeout',function($scope,$timeout){
	var classified = {};
	$scope.album_superclass_map = {
		'animal' : 'Animal',
		'person' : 'Person',
		'location' : 'Places',
		'vehicle' : 'Vehicles',
		'sport' : 'Sports',
		'geological_formation' : 'Outdoors',
		'musical_instrument' : 'Musical Instruments',
		'plant' : 'Nature',
		'electronic_equipment' : 'Electronic Gadgets',
		'misc' : 'Miscellaneous',
	}
	$scope.isLoading = false;
	$scope.inputImages = [];
	$scope.categories = [];
	var restUrl = "http://172.16.65.40:3000/";

	$('input[type=file]').change(function () {
		$scope.imagePath=this.files[0].path;
		var inputImages = [];
		$scope.isLoading=true;
		$('.file-caption-name').empty().text($scope.imagePath).data("filepath",$scope.imagePath);
		traverseFileSystem($scope.imagePath,inputImages);
		$timeout(function() {
			$scope.inputImages = inputImages;
			$scope.stagearea = 'inputImages';
			$scope.currentBreadcrumb='album';
			var temp = $scope.imagePath.split('\\');
			$scope.currentAlbum = temp[temp.length-1]
			$scope.isLoading=false;
		});
		
	});
	$(".imageClickable").click(function(){
			console.log($(this).attr('data-id'));
	});
	$(".album-panel").off("click").on("click",function(evt) {
		alert('hi');
	});
	$scope.makeImageFullscreen = function(e) {
           
			var imagePath=$(e.toElement).find('img').attr('src');
			var reportArea = $(e.toElement).find('.reportarea');
			console.log(imagePath);
			imagePath=imagePath.replace(/\/\//g,'\\')
			var serverUrl = restUrl+"getImagePreds?imagePath="+imagePath;			
			doGet(serverUrl,function(data){
			$timeout(function() {				
				var categories = data;
				categories = (categories||"").replace(/\\/g,'')
				categories = (categories||"").substr(1,categories.length-2);
				categories = JSON.parse(categories||[])
				$scope.onReport(reportArea,categories||[]);
				});
			});
        };
	$scope.classify = function(evt) {
		
		// var inputImgArr = [];
		// traverseFileSystem(imagePath,inputImgArr);
		// console.log(inputImgArr);		
		var albumHtml = "";		
		var inputDir = $(".file-caption-name").data("filepath");
		var serverUrl = restUrl+"classifier?dirname="+inputDir;
		$scope.isLoading = true;
		doGet(serverUrl,function(data){			
			$timeout(function() {		
				$scope.isLoading=false;		
				var categories = data.replace(/\\/g,'/');
				
				var categories = JSON.parse(categories);	
				console.log(categories);
				$scope.categories = [];				
				$scope.categories[$scope.categories['album_id']] = {};
				var albumsCategories = Object.keys(categories);

				for(var i=0;i<albumsCategories.length;i++) {
					console.log(albumsCategories[i]);
					if(albumsCategories[i] != 'album_id') {
					var tempCategory = categories[albumsCategories[i]];
					console.log('albumsCategories[i]'+albumsCategories[i]);
					tempCategory['category'] = albumsCategories[i];

					$scope.categories.push(tempCategory);	
					}
				}
				console.log(JSON.stringify($scope.categories));
				$scope.stagearea = 'albumsCategories';

				var temp = inputDir.split('\\');
				$scope.currentAlbum = temp[temp.length-1]				
			});
		});

		$scope.closeFullScreen = function(e,image) {
			image.isFullScreen=false;
			$scope.isFullScreen=false
		}
		
		$scope.setInputImages = function(category,isAlbum) {
			if (isAlbum) {
				var inputImages=[];
				traverseFileSystem($scope.imagePath,inputImages);
				$timeout(function() {
					$scope.inputImages = inputImages;
					$scope.currentCategory='';
					$scope.currentBreadcrumb='';	
				});
			} else {
				angular.forEach($scope.categories, function(value, index) {
					if (value.category === category) {
						$scope.inputImages = value;
						return;
					}
				});
				$scope.currentCategory = category;
				$scope.currentBreadcrumb='category';								
			}
			$scope.stagearea = 'inputImages';
		};
		$scope.alert = function(image) {
			

		};

		$scope.changeToCategory = function() {

		}
		


		//TODO: call REST API with the folder path. Expect JSON
	};


$scope.onReport = function(reportArea,categories) {			
		var chartSeries = [];
		var chartId = 'chartCols_0';
		// createChartContainer(chartId,"reportarea");
		$(reportArea).empty();
		$("<div/>", {
			id : chartId		
		}).appendTo(reportArea);
		$(categories).each(function(index,category) {
			var series = {};			
			var chartContainer = 'chartPanel';							
					series.name = category.label[1];
					series.y = category.prob;;
					chartSeries.push(series);								
			});
			doHighChart(chartId,'pie','Label Vs Probability','??',chartSeries);
		
	};
	}]);
});


// var createChartContainer = function(chartId,chartContainer) {
// 	$(".reportarea").empty();
// 	var chartCols = $('<div/>', {
//     	id: 'chartCols_0',    
// 	}).appendTo('.reportarea');

// 	$('<div/>',{
// 		id:chartId
// 	}).appendTo(chartCols);

// 	};
var doHighChart = function(chartId,chartType,chartTitle,chartSeriesName,chartData) {
	// Build the chart

	$('#'+chartId).highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: chartType,
			renderTo: "reportarea", 
		},
		colors: ["#00cee6",
										"#9b9bd7",
										"#6EDA55",
										"#fc7570",
										"#fbb755",
										"#218A8C",
										"#ef597b",
										"#7cef59",
										"#599def",
										"#ef9359",
										"#ff6d31"],
		title: {
			text: chartTitle
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					connectorColor: 'silver'
				},
				showInLegend: false
			}
		},
		series: [{
			name: chartSeriesName,
			data: chartData
		}],
		credits: {
            enabled: false
        }
	});
};
var doGet = function(serverUrl,fnServerCallBack) {
	$.get(serverUrl,function(data) {
		fnServerCallBack (data);	

			});
};
var traverseFileSystem = function (currentPath,inputImages) {

	var files = fs.readdirSync(currentPath);
	
	for (var i in files) {
		var fileName = files[i];
		var currentFile = currentPath + '\\' + fileName;
		var stats = fs.statSync(currentFile);
		if (stats.isFile()) {
			if(isFileAnImage(fileName)) {
				
				var imageInfoObj = {};
				imageInfoObj.image = currentFile;
				imageInfoObj.imageName = fileName;
				inputImages.push(imageInfoObj);
				
			}
		}
		else if (stats.isDirectory()) {
			traverseFileSystem(currentFile,inputImages);
		}
	}
};
var isFileAnImage = function(fileName){
	var extsn = getExtension(fileName);
	if(extsn.toLowerCase() == '.jpg' || extsn.toLowerCase() == '.jpeg' || extsn.toLowerCase() == '.png') {
		return true;
	}
	return false;
}

var getExtension = function(filename) {
	var i = filename.lastIndexOf('.');
	return (i < 0) ? '' : filename.substr(i);
};
