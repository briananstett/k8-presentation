const request = require('request');
const express = require('express');
const fs = require('fs');
const imgur = require('./lib/Imgur');
const path = require('path');

const app = express();
const port = 3000;
let images = [];

app.use('/static/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './html/index.html'));
})

app.get('/images', (req, res, next) => {
  fs.readdir(path.join(__dirname, 'images'), (error, files) => {
    files.forEach((file, index) => {
      files[index] = `/static/images/${file}`
    })
    return res.send(files);
  })
})

app.get('/imgur/image', (req, res, next) => {
  const imageIndex = Math.floor(Math.random() * Math.floor(images.length));
  imgur.getImageMetaData(images[imageIndex], (error, imageMetaData) => {
    if (error) {
      console.log(error);
      return res.status(502).send("ERROR");
    }

    imgur.downloadImage(imageMetaData.link, (error, image) => {
      if (error) {
        console.log(error);
        return res.status(502).send("ERROR");
      }
      images.splice(imageIndex, 1);
      res.send({ path: `/static/images/${image.fileName}` })
    });
  })

})

app.delete('/imgur/image/:image', (req, res, next) => {
  const image = req.params.image;
  console.log(image);
  fs.unlink(path.join(__dirname, `./images/${image}`), err => {
    if (err) {
      console.log(err);
      return res.status(502).send(`Could not delete file ${image}`);
    }
    return res.send(`Removed file ${image}`);
  })

})

function init() {
  if (!fs.existsSync('images/')) {
    console.log('No images directory found. \n Creating one.')
    fs.mkdirSync('images');
  }
  if (!fs.existsSync('imageIDs.json')) {
    console.log('Pulling Imgur image IDs');

    imgur.getImageIds((error, images) => {
      if (error) {
        console.log(error);
        rocess.exit();
      }
      console.log('Finished pulling image IDs');
      fs.writeFileSync('imageIDs.json', JSON.stringify(images));

      return app.listen(3000, () => {
        console.log(`Imgur puller listening port ${port}`);
      })
    })

  } else {
    images = JSON.parse(fs.readFileSync('imageIDs.json'));
    return app.listen(3000, () => {
      console.log(`Imgur puller listening port ${port}`);
    })
  }
}

function closeServer(server) {
  console.log("writing image IDs back to disk");
  fs.writeFileSync('imageIDs.json', JSON.stringify(images));
  console.log("Finished writing iamge IDs to disk");
  process.exit();
}

const server = init();

// listen for TERM signal .e.g. kill
process.on('SIGTERM', () => {
  closeServer(server)
});


// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', () => {
  closeServer(server)
});
