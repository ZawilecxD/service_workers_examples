let uploadProgress = 0;
const uploadProgressElement = document.getElementById("uploadProgress");
const uploadProgressBar = document.getElementById("uploadProgressBar");
const fileInput = document.getElementById("fileInput");
const uploadStartBtn = document.getElementById("uploadStartBtn");
const uploadCancelBtn = document.getElementById("uploadCancelBtn");

uploadStartBtn.addEventListener("click", startUpload);
uploadCancelBtn.addEventListener("click", cancelUpload);

function startUpload() {
  const file = fileInput.files[0];
  uploadWorker.postMessage({ type: "start", file: file });
  uploadStartBtn.setAttribute("disabled", true);
}
function cancelUpload() {
  uploadWorker.postMessage({ type: "cancel" });
  setProgress(0);
}

function setProgress(percent) {
  uploadProgress = percent;
  uploadProgressElement.innerHTML = uploadProgress;
  uploadProgressBar.value = uploadProgress;
}

const uploadWorker = new Worker("upload-worker.js");
uploadWorker.onmessage = function (e) {
  var data = e.data;
  var type = data.type;
  console.log(`Message received from worker: data=${JSON.stringify(data)}`);
  switch (type) {
    case "progress":
      setProgress(data.data);
      break;
    case "error":
      onUploadError(data.error);
      break;
    case "cancel":
      onUploadCancel();
      break;
    case "done":
      onUploadDone();
      break;
    default:
      console.error("Unknown command: " + type);
      break;
  }
};

function onUploadError(err) {
  console.error("UPLOAD ERROR", err);
  uploadStartBtn.removeAttribute("disabled");
}

function onUploadCancel() {
  setProgress(0);
  uploadStartBtn.removeAttribute("disabled");
}

function onUploadDone() {
  setProgress(100);
  uploadStartBtn.removeAttribute("disabled");
  console.info("File uploaded successfully.");
}

console.log("Upload script initialized");
