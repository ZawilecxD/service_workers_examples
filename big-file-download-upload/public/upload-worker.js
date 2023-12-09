const url = "http://localhost:3000/upload";
var xhr;

onmessage = function (e) {
  var data = e.data;
  var type = data.type;
  var file = data.file;

  switch (type) {
    case "start":
      startUpload(file);
      break;
    case "cancel":
      cancelUpload();
      break;
    default:
      console.error("Unknown upload-worker command: " + type);
      break;
  }
};

function startUpload(file) {
  xhr = new XMLHttpRequest();
  var formdata = new FormData();

  formdata.append("file1", file);

  xhr.open("POST", url, true);

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      postMessage({ type: "progress", data: percentComplete });
      //   console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
    }
  };

  xhr.upload.onerror = function (err) {
    console.error(err);
    postMessage({ type: "error", error: err });
  };

  xhr.onload = function () {
    if (xhr.status === 200) {
      postMessage({ type: "done" });
    } else {
      postMessage({ type: "error", error: "Upload failed!" });
    }
  };

  xhr.send(formdata);
}

function cancelUpload() {
  if (xhr) {
    xhr.abort();
    postMessage({ type: "cancel" });
  }
}
