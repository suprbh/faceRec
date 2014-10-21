// // https://github.com/wesbos/HTML5-Face-Detection

// var App = {

// };

// App.init = function() {

// 	App.video = document.querySelector('video');
//   if (!App.video) {
//     console.log('Unable to find the video element.');
//     return;
//   }


//   // Finally check if we can access the user's media
//   navigator.getUserMedia = (navigator.getUserMedia ||
//                        navigator.webkitGetUserMedia ||
//                        navigator.mozGetUserMedia ||
//                        navigator.msGetUserMedia);

//   window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

//   var successCallback = function(stream) {
//     console.log("successCallback");

//     App.canvas = document.querySelector('#output');
//     App.ctx = App.canvas.getContext("2d");

//     if (App.video.mozSrcObject !== undefined) {
//         App.video.mozSrcObject = stream;
//     } else {
//         App.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
//     };

//      // Do something with the video here, e.g. video.play()
//     App.video.play();
//     document.getElementById('snapshot').onclick = function() { 
//       App.renderScreenShot();
//       App.faceDetect();
//       console.log("Here 3");
      
//     };


//     // face recognition:

//   };

//   var errorCallback = function(e) {
//     console.log("The following error occured: " + e);
//   };

//   if(navigator.getUserMedia) {
//     console.log("User Media exists", navigator.getUserMedia);
//     // debugger;
//     navigator.getUserMedia(
//       // constraints
//       { video: true, 
//         audio: false
//       }, 
//       successCallback,
//       errorCallback
//     );
//   } else {
//     console.log("getUserMedia not supported");
//   }

//   // App.start

// };

// App.renderScreenShot = function() {
 
//   // render a captured image onto screen
//   ratio = App.video.videoWidth / App.video.videoHeight;
//   w = App.video.videoWidth - 100;
//   h = parseInt(w / ratio, 10);
//   App.canvas.width = w;
//   App.canvas.height = h;

//   App.ctx.fillRect(0, 0, w, h);
//   App.ctx.drawImage(App.video, 0, 0, w, h);

//   console.log("Here 1");
// };

// App.faceDetect = function() {
//   console.log("Here 1");

//   var image = new Image();

//   image.onload = function(){
//     // face detection:
//     // Use face detection library to find the face

//     console.log("App image", image);
//     var comp = ccv.detect_objects({ "canvas": (ccv.pre(image)),
//                  "cascade": cascade,
//                  "interval": 5,
//                  "min_neighbors": 1,
//                  async: true,  // fixme: check if mozilla - async is true
//                  worker: 1
//                });
//     console.log("faceDetection coordinates: ", comp);
    
//   };

//   image.onerror = function() {
//     console.log("Error loading image");
//   };

//   image.src = App.canvas.toDataURL();
// };

// document.addEventListener("DOMContentLoaded", function() {
// 	console.log('ready!');
// 	App.init();
// }, false);

