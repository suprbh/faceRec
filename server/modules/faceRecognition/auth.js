var fs = require('fs');
var db = require('../../app/controllers/controller.js');
var utils = require('../../app/lib/utility.js');
var fr = require('./scripts/script.js');
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
    console.log("face setupRender");

    // if you need to call the prototype methods, use "new cv.FaceRecognizer;"
    faceModule.initFaceDetect();

    res.render('face/face-setup');
  },

  initFaceDetect: function() {

    faceModule.opencvVersion = cv.version;
    faceModule.imagesPath = __dirname + "/data/";
    // faceModule.capture = new cv.VideoCapture(0);

  },

  imageCapture: function(req, res) {

    var username = req.session.username;
    console.log("username: ", username);

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
        });
    });

    cv.readImage(faceModule.imagesPath+'out.png', function(err, im){

      im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){

        for (var i=0;i<faces.length; i++){

          var face = faces[i];
          // var newIm = im.crop(face.x, face.y, face.width, face.height);
          // newIm.save(faceModule.imagesPath+'out.jpg');
          var newIm = im.roi(face.x, face.y, face.width, face.height);
          newIm.resize(213, 213, 'CV_INTER_CUBIC');
          var grey = new cv.Matrix;
          // newIm.cvtColor('CV_BGR2GRAY');
          // im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], COLOR, 2);
          newIm.save(faceModule.imagesPath+'test.png');

          // train data
          console.log("cropped image saved to: ", faceModule.imagesPath + 'test.png');
          // store to Database by username, label

        }

        // train data
        // faceModule.readTrainingData(faceModule.imagesPath);

      });

    });

  },

  readTrainingData: function(path) {
    var filePath = path + "pp_file.csv";

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

      var predict = model.predictSync(__dirname + "/data/vandi0.jpg");
      console.log("prediction: id, confidence: ", predict.id, predict.confidence);
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
