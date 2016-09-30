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
	walk('C:\\Users\\csingh\\Downloads\\Team Outing', function(err, results) {
		console.log(err);
		console.log(results);
    	// document.getElementById('display1').innerHTML = results;
    	$(results).each(function(index,val){
    		$('#display1').append("<img src='"+ val +"' class='image_thumbnail'>");
    	});
    });
    // document.getElementById('platform-info').innerHTML = os.platform();
    // document.getElementById('env-name').innerHTML = env.name;
});

var fs = require('fs');
var handlebar = require('handlebars');

$(function(){
	var classified = {};
	var restUrl = "http://172.16.65.40:3000/";
	var pieChartId = "chart-pie";

	$('input[type=file]').change(function () {
		var imagePath=this.files[0].path;
		var inputImages = [];
		$('.file-caption-name').empty().text(imagePath).data("filepath",imagePath);
		traverseFileSystem(imagePath,inputImages);

		var source = $("#imagestaging").html();
		var template = handlebar.compile(source);
		var html = template(inputImages);
		$(".stagearea").empty().append(html);
	});

	$('.classify').off('click').on('click',function(evt) {
		$('.reportarea').hide();		
		$('.stagearea').show();
		var source = $("#classified").html();
		var template = handlebar.compile(source);
		var albumHtml = "";		
		var inputDir = $(".file-caption-name").data("filepath");
		var serverUrl = restUrl+"classifier?dirname="+inputDir;
		doGet(serverUrl,function(data){
			var categories = data.replace(/\\/g,'/');
			var categories = JSON.parse(categories);
			classified.inputDir = inputDir;
			classified[inputDir] = {};
			classified[inputDir] = $.extend(true,classified[inputDir],categories);			
			localStorage.setItem('classified',JSON.stringify(classified));
			albumHtml = template(categories);
			$(".stagearea").empty().html(albumHtml);
		});
	});
	//sudip
	$('.report').off('click').on('click',function(evt) {
		$('.stagearea').hide();
		$('.reportarea').show();
		var inputDir = $(".file-caption-name").data("filepath");
		var serverUrl = restUrl+"classifier?dirname="+inputDir;
		var categories = classified[inputDir];
		console.log(JSON.stringify(categories));
		var chartSeries = [];
		for(var classKey in categories) {
			var series = {};
			var chartId = 'chart-'+classKey;
			var chartContainer = 'chartPanel';
			createChartContainer(chartId,chartContainer);
			var folderImagesInfo = categories[classKey].images;
			for(var i =0;i<folderImagesInfo.length;i++) {
				var labels = folderImagesInfo[i].labels;
				var chartSeries = [];
				for(var j=0;j<labels.length;j++) {
					var series = {};
					series.name = labels[j].label[1];
					series.y = labels[j].prob;
					chartSeries.push(series);
				}

				doHighChart(chartId,'pie','something by something','??',chartSeries);				
			}
		}
		
	});
	var createChartContainer = function(chartId,chartContainer) {

	var chartCols = $('<div/>', {
    	id: 'chartCols_'+chartId,    
    	class: 'col-xs-3 col-sm-3 col-md-3 col-lg-3',
	}).appendTo('.reportarea');

	var chartPanel = $('<div/>', {
    	//id: chartId,    
    	class: 'panel panel-primary',
	}).appendTo(chartCols);

	var chartPanelBody = $('<div/>', { 
    	class: 'panel-body chartPanel',
	}).appendTo(chartPanel);

	$('<div/>',{
		id:chartId
	}).appendTo(chartPanelBody);

	};
});

var doHighChart = function(chartId,chartType,chartTitle,chartSeriesName,chartData) {
	// Build the chart
	$('#'+chartId).highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: chartType
		},
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
//sudip
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
				imageInfoObj.imageFullPath = currentFile;
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

