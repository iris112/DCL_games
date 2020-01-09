'use strict';

var fs = require('fs');

/** Serves HLS videos to user */
exports.serveHLSVideo = function(req, res){
  var filePath = __dirname + '/assets/videos/' + req.params[0];
    
  fs.stat(filePath, function (err, stats) {
    if(!stats || err){
      res.status(404).end();
    }
    else {
      var fileExt = filePath.slice(filePath.lastIndexOf('.'));
      fileExt = fileExt && fileExt.toLowerCase() || fileExt;
      switch(fileExt) {
        case '.m3u8':
          res.status(200).set('Content-Type', 'application/vnd.apple.mpegurl');
          fs.createReadStream(filePath).pipe(res);
          break;
        case '.ts':
          res.status(200).set('Content-Type', 'video/MP2T');
          fs.createReadStream(filePath).pipe(res);
          break;
        default:
          res.status(400).send('Unexpected file type '+fileExt);
      }
    }
  });
};