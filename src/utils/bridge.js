// 与移动端桥接的公用方法
function setupWebViewJavascriptBridge(callback) {
  var bridge =
    window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge;
  if (bridge) {
    return callback(bridge);
  }
  var callbacks = window.WVJBCallbacks || window.WKWVJBCallbacks;
  if (callbacks) {
    return callbacks.push(callback);
  }
  window.WVJBCallbacks = window.WKWVJBCallbacks = [callback];
  if (window.WKWebViewJavascriptBridge) {
    window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
  } else {
    var WVJBIframe = document.createElement("iframe");
    WVJBIframe.style.display = "none";
    WVJBIframe.src = "https://__bridge_loaded__";
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  }
}

export const bridge = {
  //通用的call方法
  callhandler: (name, data, callback) => {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler(name, data, callback);
    });
  },
  //通用的registerHandler方法
  registerhandler: (name, callback) => {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler(name, function(data, responseCallback) {
        callback(data, responseCallback);
      });
    });
  }
};
