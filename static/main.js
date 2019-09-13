$(document).ready(() => {
  // References to all the element we will need.
  var video = document.querySelector("#camera-stream"),
    image = document.querySelector("#snap"),
    start_camera = document.querySelector("#start-camera"),
    controls = document.querySelector(".controls"),
    take_photo_btn = document.querySelector("#take-photo"),
    delete_photo_btn = document.querySelector("#delete-photo"),
    download_photo_btn = document.querySelector("#download-photo"),
    error_message = document.querySelector("#error-message");

  let stream = null;

  navigator.mediaDevices
    .getUserMedia({ audio: false, video: true })
    .then(function(stream) {
      console.log("stream ok");
      video.srcObject = stream;

      // Play the video element to start the stream.
      video.play();
      video.onplay = function() {
        showVideo();
      };
    })
    .catch(function(err) {
      displayErrorMessage(
        "There was an error with accessing the camera stream: " + err.name,
        err
      );
    });

  start_camera.addEventListener("click", function(e) {
    e.preventDefault();

    // Start video playback manually.
    video.play();
    showVideo();
  });

  download_photo_btn.addEventListener("click", function(e) {
    e.preventDefault();

    var hidden_canvas = document.querySelector("canvas");

    return hidden_canvas.toBlob(blob => {
      var formData = new FormData();
      formData.append("file", blob, "face.png");
      formData.append("name", $("#new-face").val());
      fetch("/add_face", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          if (json.success != false) {
            $("#new-face").hide();
            $("#hello_username").text("New face added");
          } else {
            $("#hello_username").text("Unknown error");
          }
        });
    });
    video.play();
  });

  take_photo_btn.addEventListener("click", function(e) {
    e.preventDefault();

    var snap = takeSnapshot(); // inside FormData

    image.setAttribute("src", snap);
    image.classList.add("visible");

    delete_photo_btn.classList.remove("disabled");
    download_photo_btn.classList.remove("disabled");

    video.pause();
  });

  delete_photo_btn.addEventListener("click", function(e) {
    e.preventDefault();
    $(download_photo_btn).show();
    $("#new-face").hide();
    $("#hello_username").text("");

    // Hide image.
    image.setAttribute("src", "");
    image.classList.remove("visible");

    // Disable delete and save buttons
    delete_photo_btn.classList.add("disabled");
    download_photo_btn.classList.add("disabled");

    // Resume playback of stream.
    video.play();
  });

  function showVideo() {
    // Display the video stream and the controls.

    hideUI();
    video.classList.add("visible");
    controls.classList.add("visible");
  }

  function takeSnapshot() {
    // Here we're using a trick that involves a hidden canvas element.

    var hidden_canvas = document.querySelector("canvas"),
      context = hidden_canvas.getContext("2d");

    var width = video.videoWidth,
      height = video.videoHeight;

    if (width && height) {
      // Setup a canvas with the same dimensions as the video.
      hidden_canvas.width = width;
      hidden_canvas.height = height;

      // Make a copy of the current frame in the video on the canvas.
      context.drawImage(video, 0, 0, width, height);

      // Turn the canvas image into a dataURL that can be used as a src for our photo.
      return hidden_canvas.toBlob(blob => {
        var formData = new FormData();
        formData.append("file", blob, "face.png");
        fetch("/face", {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(json => {
            $("#new-face").hide();
            $("#hello_username").show();
            if (json.username != 0) {
              $(download_photo_btn).hide();
              $("#hello_username").text(json.username);
            } else {
              $("#new-face").show();
              $("#hello_username").text("Unknown");
            }
            console.log(json);
          });
      });
    }
  }

  function displayErrorMessage(error_msg, error) {
    error = error || "";
    if (error) {
      console.log(error);
    }

    error_message.innerText = error_msg;

    hideUI();
    error_message.classList.add("visible");
  }

  function hideUI() {
    controls.classList.remove("visible");
    start_camera.classList.remove("visible");
    video.classList.remove("visible");
    snap.classList.remove("visible");
    error_message.classList.remove("visible");
  }
});
