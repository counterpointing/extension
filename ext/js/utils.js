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



function Logger() {
    'use strict';
}

Logger.prototype = {
    constructor: Logger,
/**
 * @description Log debug messages, if the debug flag is set
 *
 * @method debug
 * @param {string}
 */
debug: function () {

    'use strict';

    if (this.debugActive === true) {
        console.debug.apply(null,['[B.S. 💩 Detector] '].concat(arguments));
    }
}
}
