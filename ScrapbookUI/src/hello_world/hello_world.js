var fs = require('fs');
export var walk = function(dir, done) {	
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    console.log(list);
    var i = 0;    
    for (i=0;i<list.length;i++) {
	  var file = list[i];
	  console.log(file);
	  var f=file.split('.')
	  if (f[f.length-1].toLowerCase()==='jpg')
	  	results.push(dir+ "\\" +file);        
  	}
  	return done(null, results);
  });
};