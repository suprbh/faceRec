// // https://github.com/wesbos/HTML5-Face-Detection

// var App = {

// };

// App.init = function() {

//   App.video = document.querySelector('video');
//   if (!App.video) {
//     console.log('Unable to find the video element.');
//     return;
//   }

//   App.canvas = document.querySelector('#output');
//   App.ctx = App.canvas.getContext("2d");

//   // Finally check if we can access the user's media
//   navigator.getUserMedia = (navigator.getUserMedia ||
//                        navigator.webkitGetUserMedia ||
//                        navigator.mozGetUserMedia ||
//                        navigator.msGetUserMedia);

//   window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

//   var successCallback = function(stream) {
//     console.log("successCallback");

//     if (App.video.mozSrcObject !== undefined) {
//         App.video.mozSrcObject = stream;
//     } else {
//         App.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
//     };

//      // Do something with the video here, e.g. video.play()
//     App.video.play();
//     document.getElementById('snapshot').onclick = function() { 
//       App.renderScreenShot(stream);
//       App.faceDetect();
      
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

// App.renderScreenShot = function(stream) {
 
//   // render a captured image onto screen
//   ratio = App.video.width / App.video.height;
//   w = App.video.width - 100;
//   h = parseInt(w / ratio, 10);
//   App.canvas.width = w;
//   App.canvas.height = h;

//   App.ctx.fillRect(0, 0, w, h);
//   App.ctx.drawImage(App.video, 0, 0, w, h);

//   //close camera
//   App.video.pause();
//   App.video.src = "";
//   stream.stop();

// };

// App.faceDetect = function() {

//   var image = new Image();

//   image.onload = function(){
//     // face detection:
//     // Use face detection library to find the face

//     var comp = ccv.detect_objects({ "canvas": (ccv.pre(image)),
//                  "cascade": cascade,
//                  "interval": 5,
//                  "min_neighbors": 1
//                });
//     console.log("faceDetection coordinates: ", comp);

//     App.drawFaceBoundary(comp);
    
//   };

//   image.onerror = function() {
//     console.log("Error loading image");
//   };

//   image.src = App.canvas.toDataURL();
// };

// App.drawFaceBoundary = function(comp) {
//     App.ctx.lineWidth = 3;
//     App.ctx.strokeStyle = "#f00";
//     for (var i = 0; i < comp.length; i++) {
//         App.ctx.strokeRect(comp[i].x, comp[i].y, comp[i].width, comp[i].height);
//     }
// };

// document.addEventListener("DOMContentLoaded", function() {
// 	console.log('ready!');
// 	App.init();
// }, false);

