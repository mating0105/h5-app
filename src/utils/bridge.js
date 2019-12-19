// 与移动端桥接的公用方法
export function setBridge(callback) {
    var bridge = window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge
    if (bridge) {
        return callback(bridge);
    }
    var callbacks = window.WVJBCallbacks || window.WKWVJBCallbacks
    if (callbacks) {
        return callbacks.push(callback);
    }
    window.WVJBCallbacks = window.WKWVJBCallbacks = [callback];
    if (window.WKWebViewJavascriptBridge) {
        window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
    } else {
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    }
}

export function callBridge(name, data, callback) {
    setBridge(function (bridge) {
        bridge.callBridge(name,data, callback);
    })
}
export function registerBridge(name, callback) {
    setBridge(function (bridge) {
        bridge.registerBridge(name, function (data, responseCallback) {
            callback(data, responseCallback)
        })
    })
}