// https://github.com/wesbos/HTML5-Face-Detection

var faceRecognizer = {

};

faceRecognizer.init = function() {

  faceRecognizer.video = document.querySelector('video');
  if (!faceRecognizer.video) {
    console.log('Unable to find the video element.');
    return;
  }

  faceRecognizer.canvas = document.querySelector('#output');
  faceRecognizer.ctx = faceRecognizer.canvas.getContext("2d");

  // Finally check if we can access the user's media
  navigator.getUserMedia = (navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  var successCallback = function(stream) {
    console.log("successCallback");

    if (faceRecognizer.video.mozSrcObject !== undefined) {
        faceRecognizer.video.mozSrcObject = stream;
    } else {
        faceRecognizer.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    };

     // Do something with the video here, e.g. video.play()
    faceRecognizer.video.play();
    document.getElementById('snapshot').onclick = function() { 
      for (var count = 0; count < 5; count++){
        faceRecognizer.renderScreenShot(stream, count);
        // faceRecognizer.faceDetect();
      }

      //close camera
      faceRecognizer.video.pause();
      faceRecognizer.video.src = "";
      stream.stop();
      
    };

  };

  var errorCallback = function(e) {
    console.log("The following error occured: " + e);
  };

  if(navigator.getUserMedia) {
    console.log("User Media exists", navigator.getUserMedia);
    // debugger;
    navigator.getUserMedia(
      // constraints
      { video: true, 
        audio: false
      }, 
      successCallback,
      errorCallback
    );
  } else {
    console.log("getUserMedia not supported");
  }

};

faceRecognizer.renderScreenShot = function(stream, imNum) {
 
  // render a captured image onto screen
  ratio = faceRecognizer.video.videoWidth / faceRecognizer.video.videoHeight;
  w = faceRecognizer.video.videoWidth - 100;
  h = parseInt(w / ratio, 10);
  faceRecognizer.canvas.width = w;
  faceRecognizer.canvas.height = h;

  faceRecognizer.ctx.fillRect(0, 0, w, h);
  faceRecognizer.ctx.drawImage(faceRecognizer.video, 0, 0, w, h);

  faceRecognizer.saveImage(imNum); // save face to local file

};

faceRecognizer.faceDetect = function() {
  var image = new Image();

  image.onload = function(){
    // face detection:
    // Use face detection library to find the face

    var comp = ccv.detect_objects({ "canvas": (ccv.pre(image)),
                 "cascade": cascade,
                 "interval": 5,
                 "min_neighbors": 1
               });
    console.log("faceDetection coordinates: ", comp);

    faceRecognizer.drawFaceBoundary(comp, image);
    
  };

  image.onerror = function() {
    console.log("Error loading image");
  };

  image.src = faceRecognizer.canvas.toDataURL();
  console.log("image.src: ", image.src);
};

faceRecognizer.drawFaceBoundary = function(comp, image) {
    for (var i = 0; i < comp.length; i++) {

      // Actual face detection parameters
      // ratio = comp[i].width / comp[i].height;
      // w = comp[i].width;
      // h = parseInt(w / ratio, 10);
      // faceRecognizer.canvas.width = w;
      // faceRecognizer.canvas.height = h;
      // faceRecognizer.ctx.fillRect(0, 0, w, h);
      // faceRecognizer.ctx.drawImage(image, comp[i].x, comp[i].y, w, h, 0, 0, w, h);
      // console.log("Dimensions: ", w, h);

      // Training dimensions: 105x105
      faceRecognizer.canvas.width = 105;
      faceRecognizer.canvas.height = 105;
      faceRecognizer.ctx.fillRect(0, 0, 105, 105);
      faceRecognizer.ctx.drawImage(image, comp[i].x, comp[i].y, 105, 105, 0, 0, 105, 105);

      faceRecognizer.saveImage(); // save face to local file

      // faceRecognizer.ctx.lineWidth = 3;
      // faceRecognizer.ctx.strokeStyle = "#f00";
      // faceRecognizer.ctx.strokeRect(comp[i].x, comp[i].y, comp[i].width, comp[i].height);
      // faceRecognizer.ctx.drawImage(image, 0, 0, comp[i].width, comp[i].height);
    }
};

faceRecognizer.saveImage = function(imNum) {
  faceRecognizer.canvas = document.querySelector('#output');
  faceRecognizer.ctx = faceRecognizer.canvas.getContext("2d");

  var image = new Image();

  image.onload = function(){

    // save image
    var fileName = "pic_" + imNum + ".jpg";
    var a = document.createElement('a');
    var blob = faceRecognizer.dataURLToBlob(image.src);

    //send to server
    console.log(blob);
    faceRecognizer.sendToSersver(image.src);

    var src = window.URL.createObjectURL(blob);

    // create a download link on page to be able to download
    a.download = fileName;
    a.href = src;
    a.textContent = 'Click here to download ' + fileName + "!";

    if (a !== undefined){
      console.log("Saving picture successful", fileName);
      var span = document.createElement('span');
      span.innerHTML = '<a download="'+ fileName +'" href="'+a+'">Click here to download '+ fileName +'!</a>';
      console.log("span: ", span);
      $('body').append(span);
    } else {
      console.log("Saving picture Failed");
    }
  };

  image.onerror = function() {
    console.log("Error loading image");
  };

  image.src = faceRecognizer.canvas.toDataURL('image/png');

};

// https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
faceRecognizer.dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    console.log("raw length: ", raw.length, typeof raw);
    // faceRecognizer.sendToSersver(raw);


    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    faceRecognizer.contentType = contentType;
    console.log("Array", uInt8Array);
    return new Blob([uInt8Array], {type: contentType});
};


/**********************************************
 Send the captured image to the server
**********************************************/
faceRecognizer.sendToSersver = function(data) {

  $.ajax({
    url: "http://127.0.0.1:4568/modules/face/setup",
    type: 'POST',
    contentType: 'jsonp',
    data: JSON.stringify(data),
    success: function(data) {
      console.log("Success! ", data);
    },
    error: function(e) {
      console.log(e);
    }
  });
};

document.addEventListener("DOMContentLoaded", function() {
	console.log('ready!');
	faceRecognizer.init();
}, false);

