function Logger() {
    'use strict';

    this.debugActive = true;
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