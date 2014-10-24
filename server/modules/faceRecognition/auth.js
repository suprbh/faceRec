var fs = require('fs');
var db = require('../../app/controllers/controller.js');
var utils = require('../../app/lib/utility.js');
var fr = require('./scripts/script.js');
var cv = require('./lib/opencv');

var faceModule = {
  
/**
 * This function handles GET requests to /modules/face/setup,
 *  and renders the setup page.
 *
 * @param req
 * @param res
 */
  setupRender: function(req, res){
    console.log("face setupRender");

    cv.readImage('./data/sha0.jpg', function(err, im) {
      if (err) throw err;
      console.log("cv.readImage: ", im);
      
      if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

      // im.detectObject('../data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
      //   if (err) throw err;

        // for (var i = 0; i < faces.length; i++) {
        //   face = faces[i];
        //   im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], COLOR, 2);
        // }

        // im.save('./tmp/face-detection-rectangle.png');
        // console.log('Image saved to ./tmp/face-detection-rectangle.png');
      // });

    });

    res.render('face/face-setup');
  },

/**
 * This function handles GET requests to /modules/face/auth,
 * and renders the auth page.
 *
 * @param req
 * @param res
 */
  authRender: function(req, res){
    res.render('face/face-auth');
  },

/**
 * This function handles POST requests to /modules/face/setup,
 *  and saves the user's face to the database.
 *
 * @param req
 * @param res
 */
  setup: function(req, res){
    // var username = req.session.username;
    console.log("face/setup: ");

    // utils.collectData(req, res, function(data){
    //   // save to local file
    //   fs.writeFile("/data/"+username, JSON.parse(data), function(err){
    //     console.log(err);
    //   });
    // });
    // var userProvidedface = req.body;
    // console.log("Inside face/setup: ", userProvidedface);
    var buffer ='';
    req.on('data', function(data){
      buffer += data;
    });

    req.on('end', function(){
        var dataBuffer = new Buffer(buffer, 'base64');
        fs.writeFile('copy.png', dataBuffer, function(err){
            if(err){
                console.log(err);
            }
        });
    });

    // Add face to database of faces using opencv
    res.redirect('/index');

  },

/**
 * This function handles POST requests to /modules/face/auth,
 *  and compares the face of the user's submitted face with the face
 *  stored in the database. 
 *
 * @param req
 * @param res
 */
  auth: function(req, res){
    var username = req.session.username;
    db.readAuthTask(username, 'face', function(error, authTask, user){
      var storedFace = user.face;
      var userProvidedFace = req.body.face;
      var userProvidedPasswordHash = utils.hashPassword(userProvidedPassword);
      utils.predictFace(userProvidedFace, storedFace, function(isMatch){
        if (isMatch){
          //give token
        } else {
          res.status(403).send('Failed Authentication');
        }
      });
    });
  },
}

module.exports = faceModule;
