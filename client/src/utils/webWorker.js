/*
  ==================
  WEB WORKER HANDLER
  ==================
*/

onmessage = function(event) {
  var job = event.data;
  var mapDataFunc = eval('(' + job.mapData + ')');

  var result = mapDataFunc(job.data);
  job.result = result;

  postMessage(job);
}