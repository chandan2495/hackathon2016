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
	handlebar.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
	}); 
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
		
		// var inputImgArr = [];
		// traverseFileSystem(imagePath,inputImgArr);
		// console.log(inputImgArr);
		var source = $("#classified").html();
		var template = handlebar.compile(source);
		var albumHtml = "";		
		var inputDir = $(".file-caption-name").data("filepath");
		var serverUrl = restUrl+"classifier?dirname="+inputDir;
		doGet(serverUrl,function(data){
			var categories = data.replace(/\\/g,'/');
			
			var categories = JSON.parse(categories);	
				//console.log(categories);
				
				classified.inputDir = inputDir;
				classified[inputDir] = {};
				classified[inputDir] = $.extend(true,classified[inputDir],categories);
				console.log(classified);
				localStorage.setItem('classified',JSON.stringify(classified));
				
				albumHtml = template(categories);
				$(".stagearea").empty().html(albumHtml);
			});
		


		//TODO: call REST API with the folder path. Expect JSON
	});
});
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

