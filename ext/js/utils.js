/*!
 * B.S. Detector v0.2.7 (http://bsdetector.tech)
 * Copyright 2016 The B.S. Detector Authors (https://github.com/selfagency/bs-detector/graphs/contributors)
 * Licensed under LGPL-3.0 (https://github.com/selfagency/bs-detector/blob/master/LICENSE)
 */

/*
  Utility functions needed by the front and backends of the extension
  */

function url2Domain(url){

  'use strict';

  if(url){
    url = url.toString().replace(/^(?:https?|ftp)\:\/\//i, '');
    url = url.toString().replace(/^www\./i, '');
    url = url.toString().replace(/\/.*/, '');
    return url;
  }
}

function Util() {


}

Util.prototype = {
  constructor: Util,


    /**
     * @description Get the hostname of a given element's link
     *
     * @method getHost
     * @param {object} $element
     * @return {string}
     */
    getHost: function ($element) {

        'use strict';

        var thisUrl = '';
        if ($element.attr('data-expanded-url') !== null && $element.attr('data-expanded-url') !== undefined) {
            thisUrl = $element.attr('data-expanded-url');
        } else {
            thisUrl = $element.attr('href');
        }
        if (thisUrl !== null && thisUrl !== undefined) {
            thisUrl = this.cleanUrl(thisUrl);
        }

        return thisUrl;
    },



    /**
     * @description Check if a string is valid JSON
     *
     * @method isJson
     * @param {string} string
     * @param {boolean}
     */
    isJson: function (string) {

        'use strict';

        try {
            JSON.parse(string);
        } catch (e) {
            console.error('Given string is no valid JSON');
            return false;
        }
        return true;
    },

    /**
     * @description Strip urls down to hostname
     *
     * @method cleanUrl
     * @param {string} url
     * @return {string}
     */
    cleanUrl: function (url) {

        'use strict';

        var
            testLink = '',
            thisUrl = '';

        if (this.siteId === 'facebook') {
            testLink = decodeURIComponent(url).substring(0, 30);

            if (testLink === 'https://l.facebook.com/l.php?u=' || testLink === 'http://l.facebook.com/l.php?u=') {
                thisUrl = decodeURIComponent(url).substring(30).split('&h=', 1);
                url = thisUrl;
            }

        }

        return url2Domain(url);
    }
}