
function WidgetManager() {
    'use strict';
    this.flagState = 0; // 0 initial, 1 open, -1 hidden
    this.firstLoad = true;
    this.siteId = '';
    this.logger = new Logger();
    this.util = new Util();
}

WidgetManager.prototype = {
    constructor: WidgetManager,
    /**
     * @description
     *
     * @method setAlertOnPosts
     * @param {string}
     */

    /**
     * @description Make flags visible
     *
     * @method showFlag
     */
    showFlag: function () {

        'use strict';

        this.flagState = 1;
        $('.bs-alert').show();
    },


    /**
     * @description Make flags invisible
     *
     * @method hideFlag
     */
    hideFlag: function () {
        'use strict';

        this.flagState = -1;
        $('.bs-alert').hide();
    },

    /**
     * @description Flag entire site
     *
     * @method flagSite
     */


    flagSite: function () {

        'use strict';

        var navs = $('nav, #nav, #navigation, #navmenu');

        if (this.flagState !== 0) {
            return;
        }

        this.flagState = 1;
        this.warningMsg();

        if ($(navs)) {
            $(navs).first().addClass('bs-alert-shift');
        } else {
            $('body').addClass('bs-alert-shift');
        }

        if (this.dataType === 'caution') {
            $('body').prepend('<div class="bs-alert bs-caution"></div>');
        } else {
            $('body').prepend('<div class="bs-alert"></div>');
        }

        $('.bs-alert').append('<div class="bs-alert-close">✕</div>');
        $('.bs-alert').append('<span>' + this.warnMessage + '</span>');

        $('.bs-alert-close').on('click', function () {
            $(navs).first().removeClass('bs-alert-shift');
            $('body').removeClass('bs-alert-shift');
            $('.bs-alert').remove();
        });
    },

    /**
     * @description Generate warning message for a given url
     *
     * @method warningMsg
     */
    warningMsg: function () {

        'use strict';

        var classType = '';

        switch (this.dataType) {
            case 'bias':
                classType = 'Extreme Bias 11111';
                break;
            case 'conspiracy':
                classType = 'Conspiracy Theory';
                break;
            case 'fake':
                classType = 'Fake News';
                break;
            case 'junksci':
                classType = 'Junk Science';
                break;
            case 'rumors':
                classType = 'Rumor Mill';
                break;
            case 'satire':
                classType = 'Satire';
                break;
            case 'state':
                classType = 'State News Source';
                break;
            case 'hate':
                classType = 'Hate Group';
                break;
            case 'clickbait':
                classType = 'Clickbait';
                break;
            case 'caution':
                classType = 'Caution';
                break;
            case 'test':
                classType = 'Test';
                break;
            default:
                classType = 'Classification Pending';
                break;
        }


        if (this.dataType === 'caution') {
            this.warnMessage = '⚠️ Caution: Source may be reliable but contents require further verification.';
        } else {
            this.warnMessage = '⚠️ Warning: This may not be a reliable source. (' + classType + ')';
        }

        this.logger.debug('this.warnMessage: ', this.warnMessage);
    },
    markupPosts: function () {
        var widgetManager = this;

        $('a[data-is-bs="true"]').each(function () {
            widgetManager.dataType = $(this).attr('data-bs-type');
            widgetManager.warningMsg();

            widgetManager.logger.debug('Current warning link: ', this);
            widgetManager.logger.debug('this.bsd.dataType: ', widgetManager.dataType);

                switch (widgetManager.siteId) {
                    case 'facebook':
                        if ($(this).parents('._1dwg').length >= 0) {
                            widgetManager.flagPost($(this).closest('.mtm'));
                        }
                        if ($(this).parents('.UFICommentContent').length >= 0) {
                            widgetManager.flagPost($(this).closest('.UFICommentBody'));
                        }
                        break;
                    case 'twitter':
                        if ($(this).parents('.tweet').length >= 0) {
                            widgetManager.flagPost($(this).closest('.js-tweet-text-container'));
                        }
                        break;
                    case 'badlink':
                    case 'none':
                        break;
                    default:
                        break;
                }

                this.firstLoad = false;
            }
        );
    },
    /**
     * @description Flag links
     *
     * @method flagPost
     * @param {object} $badlinkWrapper
     */
    flagPost: function ($badlinkWrapper) {

        'use strict';

        if (!$badlinkWrapper.hasClass('bs-flag')) {

            if (this.dataType === 'caution') {
                $badlinkWrapper.before('<div class="bs-alert-inline warning">' + this.warnMessage + '</div>');
            } else {
                $badlinkWrapper.before('<div class="bs-alert-inline">' + this.warnMessage + '</div>');
            }

            $badlinkWrapper.addClass('bs-flag');
        }
    }
};
