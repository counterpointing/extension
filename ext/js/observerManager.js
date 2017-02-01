/**
 * Created by CP on 12/15/16.
 */

function ObserverManager(bsd) {
    'use strict';

    this.logger = new Logger();
    this.util = new Util();
    this.widgetManager = new WidgetManager();
}

ObserverManager.prototype = {
    constructor: ObserverManager,

    markupExternalLinks: function () {

    }
};