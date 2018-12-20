const request = require('request');
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;
let images = [];

app.get('/', (req, res, next)=>{

})

app.get('/image', (req, res, next)=>{

})

function init(){
  
}

request({
  url: 'https://api.imgur.com/3/gallery/hot/viral/day/1',
  headers :{
    Authorization: 'Client-ID 3c98709fa86ddf7'
  }},
  (error, response, body)=>{
    const galleryData = JSON.parse(body).data;
    if(response.statusCode != 200 || error ){
      console.log("Couldn't pull any image ID");
      console.log(error);
      process.exit();
    }
    galleryData.forEach(album=>{
      if (album.images){
        album.images.forEach(image=>{
          images.push(image.id);
        })
      }
    })
    console.log(images);
    app.listen(3000, ()=>{
      console.log(`Imgur puller listening port ${port}`);
    })
})

