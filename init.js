var canvas = document.getElementById('canvas');
var shareLink = document.getElementById('share_uri');
var baseURI = window.location.toString().split(/\?/)[0];

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;
init();
