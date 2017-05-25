'use strict';

Polymer({
    is: 'engagement-info-details',
    behaviors: [
        APBehaviors.DateBehavior,
        APBehaviors.StaticDataController,
        APBehaviors.PermissionController,
        APBehaviors.ErrorHandlerBehavior
    ],
    properties: {
        basePermissionPath: {
            type: String,
            observer: '_basePathChanged'
        },
        auditTypes: {
            type: Array,
            value: function() {
                return [{
                    label: 'Micro Assessment',
                    link: 'micro-assessments',
                    value: 'ma'
                }, {
                    label: 'Audit',
                    link: 'audits',
                    value: 'audit'
                }, {
                    label: 'Spot Check',
                    link: 'spot-checks',
                    value: 'sc'
                }];
            }
        },
        data: {
            type: Object,
            notify: true
        },
        originalData: {
            type: Object,
            value: function() {
                return {};
            }
        },
        errors: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },
    listeners: {
        'agreement-loaded': '_agreementLoaded'
    },
    observers: ['_errorHandler(errorObject)'],
    ready: function() {
        this.$.purchaseOrder.validate = this._validatePurchaseOrder.bind(this, this.$.purchaseOrder);
    },
    _basePathChanged: function() {
        this.updateStyles();
    },
    validate: function() {
        let typeValid = this.$.auditType.validate(),
            orderValid = this.$.purchaseOrder.validate();

        if (!typeValid) {
            this.set('errors.type', 'AuditType is required');
        }
        return typeValid && orderValid;
    },
    resetValidationErrors: function() {
        this.$.auditType.invalid = false;
        this.$.purchaseOrder.invalid = false;
    },
    _setRequired: function(field) {
        if (!this.basePermissionPath) { return false; }

        let required = this.isRequired(`${this.basePermissionPath}.${field}`);

        return required ? 'required' : false;
    },
    _resetFieldError: function(event) {
        event.target.invalid = false;
    },
    _processValue: function(value) {
        if (typeof value === 'string') {
            return this.auditTypes.filter((type) => {
                return type.value === value;
            })[0];
        } else {
            return value;
        }
    },
    _setAuditType: function(e, value) {
        this.set('data.type', value.selectedValues);
    },
    isReadOnly: function(field) {
        if (!this.basePermissionPath) { return true; }

        let readOnly = this.isReadonly(`${this.basePermissionPath}.${field}`);
        if (readOnly === null) { readOnly = true; }

        return readOnly;
    },
    _requestAgreement: function(event) {
        if (this.requestInProcess) { return; }

        let input = event && event.target,
            value = input && +input.value;

        this.resetAgreement();

        if (!value) { return; }

        this.requestInProcess = true;
        this.orderNumber = value;
        return true;
    },
    _agreementLoaded: function() {
        this.requestInProcess = false;
        this.$.purchaseOrder.validate();
    },
    resetAgreement: function() {
        this.set('data.agreement', {order_number: this.data && this.data.agreement && this.data.agreement.order_number});
    },
    _validatePurchaseOrder: function(orderInput) {
        if (this.requestInProcess) {
            this.set('errors.agreement', 'Please, wait until Purchase Order loaded');
            return false;
        }
        let value = orderInput && orderInput.value;
        if (!value && orderInput && orderInput.required) {
            this.set('errors.agreement', 'Purchase order is required');
            return false;
        }
        if (!this.data || !this.data.agreement || !this.data.agreement.id) {
            this.set('errors.agreement', 'Purchase order not found');
            return false;
        }
        this.set('errors.agreement', false);
        return true;
    },
    resetType: function() {
        this.$.auditType.value = '';
    },
    getEngagementData: function() {
        let data = {};

        if (this.originalData.start_date !== this.data.start_date) { data.start_date = this.data.start_date; }
        if (this.originalData.end_date !== this.data.end_date) { data.end_date = this.data.end_date; }
        if (this.originalData.partner_contacted_at !== this.data.partner_contacted_at) { data.partner_contacted_at = this.data.partner_contacted_at; }
        if (!this.originalData.agreement || this.originalData.agreement.id !== this.data.agreement.id) { data.agreement = this.data.agreement.id; }
        if (this.originalData.total_value !== this.data.total_value) { data.total_value = this.data.total_value; }
        if (this.originalData.type !== this.data.type.value) { data.type = this.data.type.value; }

        return data;
    },
    _errorHandler: function(errorData) {
        if (!errorData) { return; }
        this.set('errors', this.refactorErrorObject(errorData));
    }
});
