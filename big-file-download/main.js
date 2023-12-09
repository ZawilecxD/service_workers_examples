// Counter
const counterElement = document.getElementById("counter");
let counter = 0;
setInterval(() => {
  counter++;
  counterElement.innerHTML = counter;
}, 1000);

// Website
const downloadBtn = document.getElementById("downloadBtn");
const cancelBtn = document.getElementById("cancelBtn");
const urlInput = document.getElementById("urlInput");
const nameInput = document.getElementById("nameInput");
const testFileUrl = "20MB-TESTFILE.ORG.pdf"; // "https://link.testfile.org/PDF20MB";
const testFileName = "PDF_20MB.pdf";
if (testFileUrl) {
  urlInput.value = testFileUrl;
}
if (testFileName) {
  nameInput.value = testFileName;
}
let progress = 0;
const progressElement = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");

// Worker
const myWorker = new Worker("worker.js");
myWorker.onmessage = function (e) {
  var data = e.data;
  var type = data.type;
  var blob = data.blob;
  var blobName = data.blobName;
  console.log(`Message received from worker: data=${JSON.stringify(data)}`);
  switch (type) {
    case "progress":
      setProgress(data.data);
      break;
    case "error":
      onDownloadError(data.error);
      break;
    case "cancel":
      onDownloadCancel();
      break;
    case "done":
      onDownloadDone(blob, blobName);
      break;
    default:
      console.error("Unknown command: " + type);
      break;
  }
};
function startDownload() {
  myWorker.postMessage({ type: "start", url: urlInput.value });
  downloadBtn.setAttribute("disabled", true);
}

function cancelDownload() {
  myWorker.postMessage({ type: "cancel" });
}

function setProgress(percent) {
  progress = percent;
  progressElement.innerHTML = progress;
  progressBar.value = progress;
}

function onDownloadError(err) {
  console.error("DOWNLOAD ERROR", err);
  downloadBtn.removeAttribute("disabled");
}

function onDownloadCancel() {
  setProgress(0);
  downloadBtn.removeAttribute("disabled");
}

function onDownloadDone(blob, blobName) {
  var fileName = blobName;
  var tempEl = document.createElement("a");
  document.body.appendChild(tempEl);
  tempEl.style = "display: none";
  const url = window.URL.createObjectURL(blob);
  tempEl.href = url;
  tempEl.download = fileName;
  tempEl.click();
  window.URL.revokeObjectURL(url);
  downloadBtn.removeAttribute("disabled");
}
