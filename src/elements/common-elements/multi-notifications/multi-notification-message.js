'use strict';

Polymer({
    is: 'multi-notification-message',
    behaviors: [
        Polymer.IronOverlayBehavior
    ],
    properties: {
        text: {
            type: String,
            value: ''
        },
        fitInto: {
            type: Object,
            value: window,
            observer: '_onFitIntoChanged'
        },
        horizontalAlign: {
            type: String,
            value: 'left'
        },
        verticalAlign: {
            type: String,
            value: 'bottom'
        },
        duration: {
            type: Number,
            value: 3000
        },
        noCancelOnOutsideClick: {
            type: Boolean,
            value: true
        },
        offset: {
            type: Number,
            value: 0
        }
    },
    listeners: {
        'transitionend': '_onTransitionEnd',
        'push-up': '_pushUp'
    },
    _onTransitionEnd: function(e) {
        if (e && e.target === this && e.propertyName === 'opacity') {
            if (!this.opened) {
                this.fire('notification-shift', this.id);
            }
        }
    },
    _renderOpened: function() {
        this.classList.add('notification-open');
    },
    _renderClosed: function() {
        this.classList.remove('notification-open');
    },
    _onFitIntoChanged: function(fitInto) {
        this.positionTarget = fitInto;
    },
    _openedChanged: function() {
        if (this._canAutoClose) {
            this.async(this.close, this.duration);
        }
        Polymer.IronOverlayBehaviorImpl._openedChanged.apply(this, arguments);
    },
    get _canAutoClose() {
        return this.duration > 0 && this.duration !== Infinity;
    },
    _pushUp: function() {
        this.offset += 70;
        this.style.transform = `translateY(-${this.offset}px)`;
    }

});
