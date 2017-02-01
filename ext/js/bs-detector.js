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
//    this.observerManager = new ObserverManager();
    this.logger = new Logger();
    this.util = new Util();
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

        this.logger.debug('observerCallback');
        this.observerRoot.mutationSummary("disconnect");
        // this.observerExec();
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
      window.setTimeout(this.observe(this),500);
      window.setTimeout(this.setAlertOnPosts,1000);
    },

    /**
     * @description Turn on the mutation observer
     *
     * @method observe
     */
    observe: function(observerManager){

      'use strict';

        observerManager.logger.debug('observerManager.observerRoot: ', observerManager.observerRoot);

    //   this.logger.debug('observe',this.observerCallback,this.observerFilter, this.observerRoot);
        this.observerRoot.mutationSummary("connect", this.observerCallback.apply(observerManager), this.observerFilter);
    },

    /**
     * @description Main execution script
     *
     * @method execute
     */
    execute: function () {

        'use strict';
        this.doSetup();
       // this.widgetManager.doSetup();

       this.observerExec();

    },


    doSetup: function(){

        if (this.firstLoad === true) {
            this.identifySite();

            if (this.siteId === 'badlink') {
                this.flagSite();
            }

            this.firstLoad = false;
        }

        switch (this.siteId) {
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
    },


    /**
     * @description Identify current site
     *
     * @method identifySite
     */
    identifySite: function () {

        'use strict';

        // currentSite looks for the currentUrl (window.location.hostname) in the JSON data file
        this.currentUrl = this.util.cleanUrl(this.windowUrl);

        if (self === top) {
            switch (this.currentUrl) {
                case 'www.facebook.com':
                case 'facebook.com':
                    this.siteId = 'facebook';
                    break;
                case 'twitter.com':
                    this.siteId = 'twitter';
                    break;
                default:
                    this.siteId = 'none';
                    // Try to find the site in data
                    this.currentSite = this.data[this.currentUrl];
                    if (typeof this.currentSite === 'undefined') {
                        // Maybe with 'www.' prefix?
                        this.currentSite = this.data['www.' + this.currentUrl];
                        if (typeof this.currentSite === 'undefined') {
                            // Maybe with regex? (TBD)
                            // For now, consider it not in the list..
                            this.currentSite = null;
                        }
                    }
                    if (this.currentSite) {
                        this.siteId = 'badlink';
                        this.dataType = this.currentSite.type;
                    }
                    break;
            }
        }

        this.logger.debug('this.currentUrl: ', this.currentUrl);
        this.logger.debug('this.currentSite: ', this.currentSite);
        this.logger.debug('this.siteId: ', this.siteId);
        this.logger.debug('this.dataType: ', this.dataType);

    }

};