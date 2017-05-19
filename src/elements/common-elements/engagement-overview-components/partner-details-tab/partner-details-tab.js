'use strict';

Polymer({
    is: 'partner-details-tab',
    behaviors: [
        APBehaviors.StaticDataController,
        APBehaviors.PermissionController
    ],
    properties: {
        basePermissionPath: {
            type: String,
            observer: '_basePathChanged'
        },
        partners: Array,
        requestInProcess: {
            type: Boolean,
            value: false
        }
    },
    listeners: {
        'partner-loaded': '_partnerLoaded'
    },
    ready: function() {
        this.set('partners', this.getData('partners'));
    },
    _basePathChanged: function() {
        this.updateStyles();
    },
    validate: function() {
        if (!this.$.partner || !this.$.partner.required) { return true; }

        if (!this.engagement || !this.engagement.partner || !this.engagement.partner.id) {
            this.partnerErrorText = 'Partner is required';
            this.$.partner.invalid = true;
            return false;
        } else if (!this.partner.id) {
            this.partnerErrorText = 'Can not find partner data';
            this.$.partner.invalid = true;
            return false;
        } else {
            return true;
        }
    },
    resetValidationErrors: function() {
        this.$.partner.invalid = false;
    },
    _setRequired: function(field) {
        if (!this.basePermissionPath) { return false; }

        let required = this.isRequired(`${this.basePermissionPath}.${field}`);

        return required ? 'required' : false;
    },
    _resetFieldError: function(event) {
        event.target.invalid = false;
    },
    isReadOnly: function(field, basePermissionPath, inProcess) {
        if (!basePermissionPath || inProcess) { return true; }

        let readOnly = this.isReadonly(`${basePermissionPath}.${field}`);
        if (readOnly === null) { readOnly = true; }

        return readOnly;
    },
    _setReadonlyClass: function(inProcess, basePermissionPath) {
        if (this.isReadOnly('partner', basePermissionPath)) {
            return 'disabled-as-readonly';
        } else {
            return inProcess ? 'readonly' : '';
        }
    },
    _requestPartner: function(event) {
        if (this.requestInProcess) { return; }

        this.set('partner', {});

        let partnerId = event && event.detail && event.detail.selectedValues && event.detail.selectedValues.id;
        if (!partnerId) { return; }

        this.requestInProcess = true;
        this.partnerId = partnerId;
        return true;
    },
    _partnerLoaded: function() {
        this.requestInProcess = false;
        this.validate();
    }
});
