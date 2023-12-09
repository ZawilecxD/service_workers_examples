onmessage = function (e) {
  console.log({ e });
  var data = e.data;
  var type = data.type;
  var url = data.url;
  var fileName = data.fileName;
  var xmlHTTP;

  console.log(
    `Message received from main script: data=${JSON.stringify(data)}`
  );
  switch (type) {
    case "start":
      saveOrOpenBlob(url, fileName);
      break;
    case "cancel":
      cancelRequest();
      break;
    default:
      console.error("Unknown command: " + type);
      break;
  }
};

function saveOrOpenBlob(url, blobName) {
  var blob;
  xmlHTTP = new XMLHttpRequest();
  xmlHTTP.open("GET", url, true);
  xmlHTTP.responseType = "arraybuffer";
  xmlHTTP.onload = function (e) {
    blob = new Blob([this.response]);
  };
  xmlHTTP.onprogress = function (pr) {
    var progressPercent = Math.round((pr.loaded / pr.total) * 100);
    postMessage({ type: "progress", data: progressPercent });
  };
  xmlHTTP.onerror = function (err) {
    console.error(err);
    postMessage({ type: "error", error: err });
  };
  xmlHTTP.onloadend = function (e) {
    if (e.loaded) {
      postMessage({ type: "done", blob, blobName });
    }
  };
  xmlHTTP.send();
}

function cancelRequest() {
  if (xmlHTTP) {
    xmlHTTP.abort();
    postMessage({ type: "cancel" });
  }
}
