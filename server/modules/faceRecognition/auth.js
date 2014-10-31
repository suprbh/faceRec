var fs = require('fs');
var db = require('../../app/controllers/controller.js');
var utils = require('../../app/lib/utility.js');
// var fr = require('./scripts/script.js');
// var cv = require('./lib/opencv.node');
var cv = require('opencv');

var faceModule = {
  
/**
 * This function handles GET requests to /modules/face/setup,
 *  and renders the setup page.
 *
 * @param req
 * @param res
 */
  setupRender: function(req, res){

    console.log("face setupRender", req.session.user);

    // if you need to call the prototype methods, use "new cv.FaceRecognizer;"
    faceModule.initFaceDetect();

    res.render('face/face-setup');
  },

  /*******************************************
  * Initialize the path where to store the images,
  * and get the opencv version (just for checking)
  *********************************************/
  initFaceDetect: function() {

    faceModule.opencvVersion = cv.version;
    faceModule.imagesPath = __dirname + "/data/";
  },

  imageCapture: function(req, res) {

    var username = req.session.username;
    console.log("imageCapture[username]: ", username);

    var vidStream = cv.VideoCapture(0);
    var count = 0;

    var detect = function() {
      vidStream.read(function(im){
        im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
          console.log("I spy ", faces.length, " faces" );
          for (var i=0;i<faces.length; i++){

                var face = faces[i];
                var newIm = im.roi(face.x, face.y, face.width, face.height);
                newIm.resize(200, 200, 'CV_INTER_CUBIC');

                //save the image
                newImFileName = faceModule.imagesPath+ username_count + '.png';
                newIm.save(newImFileName);

                console.log("cropped image saved to: ", newImFileName);
                // TODO: store to Database by username, label
                // train data
                // faceModule.writeTrainingData(newImFileName);
              }
          if (++count < 6){
            detect();
          }
        });
      });
    }

    detect();

    /*********************************
    * This section of code receives image from the browser when
    * the user clicks 'snapshot', and sends to the server.
    * The face is then detected and stored in a file.
    * Since it is called in the setup process, we only train the
    * the Fisher face recognizer with the training data of n no.of
    * images.
    **********************************
    var buffer ='';
    req.on('data', function(data){
      buffer += data;
    });

    req.on('end', function(){
        var base64Data = JSON.parse(buffer).replace(/^data:image\/png;base64,/, "");
        fs.writeFile(faceModule.imagesPath+'out.png', base64Data, 'base64', function(err){
          if(err){
              console.log(err);
          }
          console.log("Written to file: ", faceModule.imagesPath+'out.png');
          res.send(200, "Success writing to file");

          cv.readImage(faceModule.imagesPath+'out.png', function(err, im){

            im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){

              for (var i=0;i<faces.length; i++){

                var face = faces[i];
                var newIm = im.roi(face.x, face.y, face.width, face.height);
                newIm.resize(213, 213, 'CV_INTER_CUBIC');
                
                // change image to grayscale
                // newIm.cvtColor('CV_BGR2GRAY');
                // draw rectangle around the face
                // im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], COLOR, 2);
                
                //save the image
                newIm.save(faceModule.imagesPath+'test.png');

                console.log("cropped image saved to: ", faceModule.imagesPath + 'test.png');
                // TODO: store to Database by username, label
                // train data
                faceModule.readTrainingData(faceModule.imagesPath, req, res);
              }

            });
          });

        });
    });*/

  },

  readTrainingData: function(path, req, res) {
    var filePath = path + "pp_file_classlist.csv";

    fs.readFile(filePath, function(err, buffer){
      if(err) console.log(err);

      var data = buffer.toString( "utf8", 0, buffer.length );
      // console.log("file data: ", data);
      
      var lines = data.trim().split('\n');
      var images = [];
      var labels = [];
      var tupleList = [];

      for (var row = 0; row < lines.length; row++){
        var cols = lines[row].split(';');
        
        tupleList.push([parseInt(cols[1]), cols[0]]);
      
      }

      console.log("tupleList: ", tupleList);

      // train data
      var faceRec = cv.FaceRecognizer; 
      var model = faceRec.createFisherFaceRecognizer();
      model.trainSync(tupleList);
      console.log("Here");
      var predict = model.predictSync(faceModule.imagesPath + 'test.png');
      console.log("prediction: id, confidence: ", predict.id, predict.confidence);
      var names = ["Supriya", "Ryo", "Carl", "Allen", ];

      // var statusCode = 200;
      var username = names[predict.id];
      if (names[predict.id] === undefined){
        
        // statusCode = 404;
        username = "not registered";
        console.log(req.session.user, "Not registered");

      } else if (predict.confidence >= 2500){
          
          console.log("Not sure who you are");
          console.log("Try loggin in again with brighter lighting or using other methods of Authentication...");
      
      } else {
       
       console.log("Hello ", names[predict.id], "!");
       
       var token = utils.makeToken(req);
       res.send(JSON.stringify({token:token}));
      
      }

    });

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
    var username = req.session.username;
    console.log("face/setup: ");

    faceModule.imageCapture(req, res);

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

    // train data
    faceModule.readTrainingData(faceModule.imagesPath);

    // db.readAuthTask(username, 'face', function(error, authTask, user){
    //   var storedFace = user.face;
    //   var userProvidedFace = req.body.face;
    //   var userProvidedPasswordHash = utils.hashPassword(userProvidedPassword);
    //   utils.predictFace(userProvidedFace, storedFace, function(isMatch){
    //     if (isMatch){
    //       //give token
    //     } else {
    //       res.status(403).send('Failed Authentication');
    //     }
    //   });
    // });
  },
}

module.exports = faceModule;
