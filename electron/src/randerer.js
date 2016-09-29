
var fs = require('fs');
var handlebar = require('handlebars');

$(function(){
	var classified = {};
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
		// var imagePath = $(".file-caption-name").data("filepath");
		// var inputImgArr = [];
		// traverseFileSystem(imagePath,inputImgArr);
		// console.log(inputImgArr);
		classified = localStorage.getItem('classified');
		var source = $("#classified").html();
		var template = handlebar.compile(source);
		var albumHtml = "";
		var inputDir = "c:/htest";
		if (classified==null) {
			classified = {};
			classified.inputDir={};
			$.get('http://172.16.65.40:3000/classifier?dirname=C:\\htest',function(data) {
				var categories = data.replace(/\\/g,'/');
				console.log(categories);			
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

		} else {
			var obj = JSON.parse(classified);
			var categories = obj[inputDir];
			console.log(categories);
			albumHtml = template(categories);
			$(".stagearea").empty().html(albumHtml);
		} 


		//TODO: call REST API with the folder path. Expect JSON
	});
});
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

