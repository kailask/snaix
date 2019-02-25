
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('snaix.html', {
    'innerBounds': {
      'width': 1280,
      'height': 660
    },
	"resizable": false,
  });

});