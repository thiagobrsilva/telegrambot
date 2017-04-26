var conversorController = function(Order)
{
  // Libs
  var horizon = require('horizon-youtube-mp3');
  var youtubedl = require('youtube-dl');

  var fs = require('fs');
  var path = require('path');
  var flName = "";


   // Insert on mongoDB a new record and then process
   var post = function(req,res){
      var order = new Order(req.body);
      order.save(function(err){
         if (err){
            res.status(500).send(err);
         }else{

           // Getting video url
           var link = order.link;

           console.log(link);
           console.log(order.type);

           if (order.type=="MP3")
           {
               horizon.download(link, downloadPath, null, null, function(e){
                 console.log('fim download');
               });

               // Saving mp3 on downloadPath+"/"+flName
               horizon.getInfo(link, function(e){
                   flName = e.videoName +"."+order.type;
                   console.log(downloadPath+"/"+flName);
                   res.status(201).send(downloadPath+"/"+flName);
                   console.log('fim getInfo');
               });
           }

           if (order.type=="Video")
           {
               var videoID = new Date().getFullYear()+new Date().getMonth()+new Date().getDate()+"_"+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds();

               var video = youtubedl(link,
                // Optional arguments passed to youtube-dl.
                ['--format=18'],
                // Additional options can be given for calling `child_process.execFile()`.
                { cwd: downloadPath });

              // Will be called when the download starts.
              video.on('info', function(info) {
                console.log('Download started');
              });

              // Saving mp4 on downloadPath+"/"+videoID+".mp4"
              video.pipe(fs.createWriteStream(downloadPath+"/"+videoID+".mp4"));
              res.status(201).send(downloadPath+"/"+videoID+".mp4");

           }

           // Updating Status and Finish Date
           Order.findById(order._id, function(err, ord) {
               ord.status = '1';
               ord.finish_dt = Date.now();

               ord.save(function(err) {
                   if (err)
                       console.log(err);
               });

           });


         }
      });

  }

    // return available http verbs
    return {
      post:post
    }
}


module.exports = conversorController;
