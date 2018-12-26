const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.getImageIds = function (callback){
  let images = [];
  request({
    url: 'https://api.imgur.com/3/gallery/hot/viral/day/1',
    headers :{
      Authorization: 'Client-ID 3c98709fa86ddf7' // TODO move this to an environment variable
    }},
    (error, response, body)=>{
      if(response.statusCode != 200 || error ){
        console.log("Couldn't pull any image ID");
        console.log(error);
        console.log("Status Code", response.statusCode);
        return callback(error);
      }
      const galleryData = JSON.parse(body).data;
      galleryData.forEach(album=>{
        if (album.images){
          album.images.forEach(image=>{
            images.push(image.id);
          })
        }
      })

      callback(null, images);
    })
}

module.exports.getImageMetaData = function (imageId, callback){
  request({
    url: `https://api.imgur.com/3/image/${imageId}`,
    headers: {
      Authorization: 'Client-ID 3c98709fa86ddf7' // TODO move this to an environment variable
    }
  },(error, response, body)=>{
    if(response.statusCode != 200 || error ){
      console.log("Couldn't pull any image metaData");
      console.log(error);
      console.log("Status Code", response.statusCode);
      return callback(error);
    }
    const {id, type, link } = JSON.parse(body).data;
    callback(null, {id, type, link})
  })
}

module.exports.downloadImage = function(link, callback){
  const fileName = link.split(".com/")[1];
  request
    .get(link)
    .on('complete', complete=>{
      callback(null, {fileName})
    })
    .on('error', console.log)
    .pipe(fs.createWriteStream(path.join(__dirname, `../images/${fileName}`)));
}


