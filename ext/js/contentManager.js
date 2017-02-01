/**
 * Created by CP on 12/14/16.
 */

function ContentManager(bsd) {

    'use strict';
    this.bsd = bsd;
    this.currentSite = null;
    this.currentUrl = '';
    this.data = [];
    this.dataType = '';
    this.debugActive = false;
    this.expandLinks = null;
    this.expanded = {};
    this.flagState = 0; // 0 initial, 1 open, -1 hidden
    this.firstLoad = true;
    this.shorts = [];
    this.shortUrls = [];

    this.warnMessage = '';
    this.mutationObserver = {};
    this.windowUrl = window.location.hostname;
    this.observerRoot = null;
    this.observerFilter = null;
    this.ownHostRegExp = new RegExp( window.location.host );
    this.lfbRegExp = new RegExp( /^https?:\/\/l\.facebook\.com\/l\.php\?u=([^&]+)/);
    this.logger = new Logger();
    this.util = new Util();
    this.widgetManager = new WidgetManager();
}

ContentManager.prototype = {
    constructor: ContentManager,

    markupExternalLinks: function(){
        'use strict';

        // find and label external links
        $('a[href]:not([href^="#"]), a[data-expanded-url]').each(function () {

            var
                testLink = '',
                thisUrl = '',
                matches = null;

            var ownHostRegExp = new RegExp( window.location.host );
            // exclude links that have the same hostname
            if (!ownHostRegExp.test(this.href)) {
                $(this).attr('data-external', true);
            }

            // convert facebook urls
            if (this.siteId === 'facebook') {

                testLink = decodeURIComponent(this.href);
                if(matches = this.bsd.lfbRegExp.exec(this.href)){
                    thisUrl = decodeURIComponent(matches[1]);
                }
                if (thisUrl !== '') {
                    $(this).attr('data-external', true);
                    $(this).attr('data-expanded-url', thisUrl);
                }
            }
        });
    },

    processExternalLinks: function() {
        'use strict';
        // process external links

        var contentManager = this;

        $('a[data-external="true"]').each(function () {
            var urlHost = '';

            if ($(this).attr('data-is-bs') !== 'true') {
                urlHost = contentManager.util.getHost($(this));
                // check if link is in list of bad domains
                this.bsId = contentManager.data[urlHost];

                // if link is in bad domain list, tag it
                if (typeof this.bsId !== 'undefined') {
                    $(this).attr('data-is-bs', true);
                    $(this).attr('data-bs-type', this.bsId.type);
                }
            }
        });
    },

    setAlertOnPosts: function () {
        this.markupExternalLinks();
        this.processExternalLinks();
        this.widgetManager.markupPosts();
    },



    /**
     * @description Expand short urls and append to anchor tags
     *
     * @method getLinks
     */
    getLinks: function () {

        'use strict';

        $.each(this.shorts, function () {
            var
                shortLink = 'a[href*="' + $(this) + '"]';

            $(shortLink).each(function () {
                this.bsd.toExpand.push($(this).attr('href'));
            });
        });
    },


    /*
     * @description Expanding short urls
     *
     * @method processLinks
     */
    processLinks: function () {

        'use strict';

        if (this.toExpand) {

            this.debug('this.toExpand[]: ', this.toExpand);

            chrome.runtime.sendMessage(null, {
                'operation': 'expandLinks',
                'shortLinks': this.toExpand.toString()
            }, null, function (response) {
                this.debug('Expanded Links: ', response);

                if (this.isJson(response)) {
                    this.expanded = JSON.parse(response);
                    $.each(this.expanded, function (key, value) {
                        $('a[href="' + value.requestedURL + '"]').attr('longurl', value.resolvedURL);
                    });
                } else {
                    this.debug('Could not expand shortened link');
                    this.debug('Response: ' + response);
                }
            });
        }
    }
};
