var conversorController = function(Order)
{
  var horizon = require('horizon-youtube-mp3');
  var path = require('path');
  var flName = "";


   // insert
   var post = function(req,res){
      var order = new Order(req.body);
      order.save(function(err){
         if (err){
            res.status(500).send(err);
         }else{

           var strResult;

           if (order.type=="MP3")
           {

               var link = order.link;
               horizon.download(link, downloadPath, null, null, function(e){
                 console.log('fim download');
               });

               horizon.getInfo(link, function(e){
                   flName = e.videoName +"."+order.type;
                   console.log(downloadPath+"/"+flName);
                   res.status(201).send(downloadPath+"/"+flName);
                   console.log('fim getInfo');
               });


           }


         }
      });

  }

    // return available http verbs
    return {
      post:post
    }
}


module.exports = conversorController;
