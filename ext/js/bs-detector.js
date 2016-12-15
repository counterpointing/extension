/*!
 * B.S. Detector v0.2.7 (http://bsdetector.tech)
 * Copyright 2016 The B.S. Detector Authors (https://github.com/selfagency/bs-detector/graphs/contributors)
 * Licensed under LGPL-3.0 (https://github.com/selfagency/bs-detector/blob/master/LICENSE)
 */

/*global chrome,browser,self,top,console,$,JSON,MutationObserver*/
/*jslint browser: true */

/**
 * @description Class constructor with variable initialisation
 *
 * @method BSDetector
 */
function BSDetector() {

    'use strict';

    this.bsId = null;
    this.currentSite = null;
    this.currentUrl = '';
    this.data = [];
    this.dataType = '';
    this.debugActive = true;
    this.expandLinks = null;
    this.expanded = {};
    this.flagState = 0; // 0 initial, 1 open, -1 hidden
    this.firstLoad = true;
    this.shorts = [];
    this.shortUrls = [];
    this.siteId = '';
    this.warnMessage = '';
    this.mutationObserver = {};
    this.windowUrl = window.location.hostname;
    this.observerRoot = null;
    this.observerFilter = null;
    this.ownHostRegExp = new RegExp( window.location.host );
    this.lfbRegExp = new RegExp( /^https?:\/\/l\.facebook\.com\/l\.php\?u=([^&]+)/);
    this.widgetManager = new WidgetManager();
    this.contentManager = new ContentManager();
    this.logger = new Logger();
}

BSDetector.prototype = {

    constructor: BSDetector,

    /**
     * @description Asynchronous loading function
     *
     * @method asynch
     * @param {string} thisFunc
     * @param {function} callback
     */
    asynch: function (thisFunc, callback) {

        'use strict';

        setTimeout(function () {
            thisFunc();
            if (typeof callback === 'function') {
                callback();
            }
        }, 10);
    },

    /**
     * @description Main run this after a mutation
     *
     * @method observerCallback
     */
    observerCallback: function(){

      'use strict';

      bsd.logger.debug('observerCallback');
      bsd.observerRoot.mutationSummary("disconnect");
      bsd.observerExec();
    },

    /**
     * @description Scan for posts, turn on the observer, and scan again for more changes
     *
     * @method observerExec
     */
    observerExec: function(){

      'use strict';

      this.logger.debug('observerExec');
      this.contentManager.setAlertOnPosts();
      window.setTimeout(this.observe,500);
      window.setTimeout(this.setAlertOnPosts,1000);
    },

    /**
     * @description Turn on the mutation observer
     *
     * @method observe
     */
    observe: function(){

      'use strict';

      bsd.logger.debug('observe',bsd.observerCallback,bsd.observerFilter, bsd.observerRoot);
      bsd.observerRoot.mutationSummary("connect", bsd.observerCallback, bsd.observerFilter);
    },

    /**
     * @description Main execution script
     *
     * @method execute
     */
    execute: function () {

        'use strict';

        if (this.firstLoad === true) {
            this.contentManager.identifySite();

            if (this.contentManager.siteId === 'badlink') {
                this.contentManager.flagSite();
            }

            this.firstLoad = false;
        }

        switch (this.contentManager.siteId) {
        case 'facebook':
            this.observerRoot = $("body");
            this.observerFilter = [{ element:"div" }];
            break;
        case 'twitter':
            this.observerRoot = $("div#page-container");
            this.observerFilter = [{ element:"div" }];
            break;
        case 'badSite':
            break;
        case 'none':
        default:
            this.observerRoot = $("body");
            this.observerFilter = [{ element:"div" }];
            break;
        }

        this.observerExec();

    }
};