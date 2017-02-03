
/*global chrome,browser,self,top,console,$,JSON,MutationObserver*/
/*jslint browser: true */


// If we don't have a browser object, check for chrome.
if (typeof chrome === 'undefined' && typeof browser !== 'undefined') {
    chrome = browser;
}
//
function loadRes(res) {
    return new Promise(
        function(resolve, reject) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'import');
            link.setAttribute('href', res);
            link.onload = function() {
                resolve(res);
            };
            document.head.appendChild(link);
        });
}

//
// function loadRes(res) {
//     return new Promise(
//         function(resolve, reject) {
//             var script = document.createElement('script');
//             script.setAttribute('src', resolve(res));
//             // link.onload = function() {
//             //     resolve(res);
//             // };
//             document.appendChild(script);
//         });
// }
// //
// var script = document.createElement('<script>');
// script.src = chrome.extension.getURL('something.js');
// document.appendChild(script);


window.addEventListener("WebComponentsReady", function(e) {
    console.log("example - WebComponentsReady");

//    var XFoo = document.registerElement('paper-button');
    var XFoo = document.createElement("cp-app");                       // Create a <p> node

    var para = document.createElement("P");                       // Create a <p> node
    var t = document.createTextNode("This is a paragraph.");      // Create a text node
    para.appendChild(t);                                          // Append the text to <p>
//    document.getElementsByClassName("below-entry__content")[0].appendChild(para);           // Append <p> to <div> with id="myDIV"
        document.getElementsByClassName("below-entry__content")[0].appendChild(XFoo);


});

// //    .then( loadRes( chrome.extension.getURL("index.build.js") ) )
loadRes( chrome.extension.getURL("index.build.js") ) // You may/may not need webcomponents.js here
//    .then(loadRes( chrome.extension.getURL("bower_components/polymer/polymer.html") ))
   .then(loadRes( chrome.extension.getURL("index.build.html") ))

    .then(function(){
//
        // code that depends on web components
    });

/**
 * @description Grab data from background and execute extension
 * @link https://developer.chrome.com/extensions/runtime#method-sendMessage
 *
 * @method chrome.runtime.sendMessage
 * @param {string} extensionId
 * @param {mixed} message
 * @param {object} options
 * @param {function} responseCallback
 */
if(window === window.top || url2Domain(window.location.hostname) == 'twitter.com'){
    var bsd = new BSDetector();


    /**
     * @description Grab data from background and execute extension
     *
     * @method
     * @param {string}
     */
    chrome.runtime.sendMessage(null, {'operation': 'passData'}, null, function (state) {

        'use strict';

        bsd.contentManager.data = state.sites;
        bsd.contentManager.shorts = state.shorteners;

        bsd.widgetManager.data = state.sites;
        bsd.widgetManager.shorts = state.shorteners;

        // Data loaded, start execution.
        $(document).ready(function () {

            bsd.expandLinks = bsd.asynch.bind(null, bsd.contentManager.getLinks, bsd.contentManager.processLinks);
            bsd.execute();
        });
    });
}


/**
 * @description Listen for messages but only in the top frame
 * @link https://developer.chrome.com/extensions/runtime#event-onMessage
 *
 * @method chrome.runtime.onMessage.addListener
 * @param {function}
 */
if (window.top === window) {
    chrome.runtime.onMessage.addListener(function (message) {

        'use strict';

        switch (message.operation) {
            case 'flagSite':
                bsd.dataType = message.type;
                bsd.widgetManager.flagSite();
                break;
            case 'toggleFlag':
                if (bsd.flagState === 1) {
                    bsd.widgetManager.hideFlag();
                } else if (bsd.flagState === -1) {
                    bsd.widgetManager.showFlag();
                }
                break;
        }
    });
}