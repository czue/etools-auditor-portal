'use strict';

Polymer({
    is: 'engagement-staff-members-tab',

    behaviors: [
        APBehaviors.TableElementsBehavior
    ],
    properties: {
        mainProperty: {
            type: String,
            value: 'staff_members'
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                    user: {
                        first_name: '',
                        last_name: '',
                        email: '',
                        is_active: true,
                        profile: {
                            job_title: '',
                            phone_number: ''
                        }
                    },
                    receive_audit_notifications: false
                };
            }
        },
        columns: {
            type: Array,
            value: function() {
                return [
                    {
                        'size': 17,
                        'label': 'Position',
                        'name': 'user.profile.job_title'
                    }, {
                        'size': 17,
                        'label': 'First Name',
                        'name': 'user.first_name'
                    }, {
                        'size': 17,
                        'label': 'Last Name',
                        'name': 'user.last_name'
                    }, {
                        'size': 17,
                        'label': 'Phone Number',
                        'name': 'user.profile.phone_number'
                    }, {
                        'size': 17,
                        'label': 'E-mail Address',
                        'name': 'user.email'
                    },
                    {
                        'size': 8,
                        'label': 'Notify',
                        'name': 'receive_audit_notifications',
                        'property': 'receive_audit_notifications',
                        'custom': true
                    },
                    {
                        'size': 7,
                        'label': 'Edit',
                        'name': 'edit',
                        'icon': true
                    }
                ];
            }
        },
        addDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Add new Staff Member'
                };
            }
        },
        editDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Edit Staff Member'
                };
            }
        }
    },

    listeners: {
        'dialog-confirmed': '_addItemFromDialog'
    },

    observers: [
        'resetDialog(dialogOpened)',
        'changePermission(basePermissionPath)',
        '_errorHandler(errorObject.staff_members)'
    ],

    attached: function() {
        this.$.emailInput.validate = this._validEmailAddress.bind(this, this.$.emailInput);
    },

    _validEmailAddress: function(emailInput) {
        let value = emailInput.value,
            required = emailInput.required;

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (required && !value) {
            this.errors = {user: {email: 'Email is required'}};
            return false;
        }
        if (value && !re.test(value)) {
            this.errors = {user: {email: 'Email is incorrect'}};
            return false;
        }

        let valid = true;

        if (this.saveWithButton) {
            _.each(this.dataItems, item => {
                if (item.user && item.user.email === this.editedItem.user.email) {
                    this.errors = {user: {email: 'Email must be unique'}};
                    valid = false;
                }
            });
        }

        return valid;
    }

});
