const request = require('request');
const express = require('express');

let images = [];


request('https://api.imgur.com/3/gallery/hot/viral/day/1', 
  (error, response, body)=>{
    const galleryData = JSON.parse(body).data;
    galleryData.forEach((album)=>{   
      console.log(album); 
      album.images.forEach((image)=>{
        console.log(image);
      })
    })

})