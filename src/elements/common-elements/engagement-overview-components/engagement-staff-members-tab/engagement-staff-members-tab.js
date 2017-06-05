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
        dataItems: {
            type: Array,
            observer: '_dataItemsChanged',
            value: function() {
                return [];
            }
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                    user: {
                        first_name: '',
                        last_name: '',
                        email: '',
                        profile: {
                            job_title: '',
                            phone_number: ''
                        }
                    },
                    hasAccess: true
                };
            }
        },
        columns: {
            type: Array,
            value: function() {
                return [
                    {
                        'size': 18,
                        'label': 'Position',
                        'name': 'user.profile.job_title'
                    }, {
                        'size': 18,
                        'label': 'First Name',
                        'name': 'user.first_name'
                    }, {
                        'size': 18,
                        'label': 'Last Name',
                        'name': 'user.last_name'
                    }, {
                        'size': 18,
                        'label': 'Phone Number',
                        'name': 'user.profile.phone_number'
                    }, {
                        'size': 18,
                        'label': 'E-mail Address',
                        'name': 'user.email'
                    },
                    {
                        'size': 10,
                        'label': 'Has Access',
                        'name': 'hasAccess',
                        'align': 'center',
                        'property': 'hasAccess',
                        'checkbox': true
                    },
                    {
                        'size': '45px',
                        'label': 'Edit',
                        'name': 'edit',
                        'align': 'center',
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
        },
        listQueries: {
            type: Object,
            value: function() {
                return {
                    page: 1,
                    page_size: 10
                };
            }
        },
        engagementStaffs: {
            type: Object,
            value: function() {
                return {};
            }
        },
        listLoading: {
            type: Boolean,
            value: false
        },
        showingResults: {
            type: String,
            computed: '_calcShowingResults(datalength, listSize, listPage, searchQuery, dataItems.length)'
        },
        datalength: {
            type: Number,
            value: 0
        },
        searchQuery: {
            type: String,
            value: ''
        }
    },

    listeners: {
        'dialog-confirmed': '_addStaffFromDialog',
        'staff-updated': '_staffUpdated'
    },

    observers: [
        'resetDialog(dialogOpened)',
        'changePermission(basePermissionPath)',
        '_handleUpdateError(errorObject.staff_members)',
        '_organizationChanged(engagement.agreement.audit_organization.id, basePermissionPath)',
        '_organizationChanged(engagement.agreement.audit_organization.id)',
        '_queriesChanged(listSize, listPage, searchQuery)',
        '_dataItemsChanged(dataItems, engagementStaffs)',
        '_selectedStaffsChanged(engagement.staff_members, basePermissionPath)',
        'updateStyles(emailChecking)'
    ],

    attached: function() {
        this.$.emailInput.validate = this._validEmailAddress.bind(this, this.$.emailInput);
        this.listSize = 10;
        this.listPage = 1;
    },

    changePermission: function(basePermissionPath) {
        if (!basePermissionPath) { return; }
        let editObj = this.columns && this.columns[this.columns.length - 1];
        if (this._canBeChanged() && editObj && editObj.name !== 'edit') {
            _.each(this.columns, (value, index) => {
                this.set(`columns.${index}.size`, 18);
            });
            this.push('columns', {'size': 10,'label': 'Has Access','name': 'hasAccess', 'property': 'hasAccess', 'checkbox': true});
            this.push('columns', {'size': '45px','label': 'Edit','name': 'edit','align': 'center','icon': true});
        } else if (!this._canBeChanged() && editObj && editObj.name === 'edit') {
            this.pop('columns');
            this.pop('columns');
            _.each(this.columns, (value, index) => {
                this.set(`columns.${index}.size`, 20);
            });
        }
    },

    _organizationChanged: function(id) {
        if (!this._canBeChanged() || !this.basePermissionPath) { return; }
        if (!id) { this.resetList(); }
        this.organisationId = +id;
    },

    _queriesChanged: function(listSize, listPage, searchQuery) {
        if (!listPage || !listSize) { return; }

        if (((this.lastSize && this.lastSize !== listSize) ||
             (!_.isUndefined(this.lastSearchQuery) && this.lastSearchQuery !== searchQuery)) && this.listPage !== 1) {
            this.lastSearchQuery = searchQuery;
            this.lastSize = listSize;
            this.listPage = 1;
            return;
        }
        this.lastSize = listSize;
        this.lastSearchQuery = searchQuery;

        this.set('listQueries', {
            page_size: listSize,
            page: listPage,
            search: searchQuery || ''
        });
    },

    _dataItemsChanged: function(data, staffs) {
        if (!staffs) { return; }
        _.each(data, (staff, index) => {
            this.dataItems[index].hasAccess = !!this.engagementStaffs[staff.user.email];
        });
    },

    _selectedStaffsChanged: function(data) {
        if (!data) { return; }
        if (!this._canBeChanged()) {
            this.set('dataItems', _.cloneDeep(data));
            return;
        }
        if (!this.engagementStaffs) { this.set('engagementStaffs', {}); }
        _.each(data, staff => {
            this.engagementStaffs[staff.user.email] = staff.id;
        });
        if (this.dataItems) {
            _.each(this.dataItems, (staff, index) => {
                this.set(`dataItems.${index}.hasAccess`, !!this.engagementStaffs[staff.user.email]);
            });
        }
    },

    _calcShowingResults: function(datalength, listSize, listPage, searchQuery, itemsLength) {
        let last = listSize * listPage,
            first = last - listSize + 1,
            length = searchQuery ? itemsLength : datalength;

        if (last > length) { last = length; }
        if (first > length) { first = 0; }
        return `${first}-${last} of ${length}`;
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
                if (item.user && item.user.email === this.editedItem.user.email &&
                    item.id && item.id === this.editedItem.id) {
                    this.errors = {user: {email: 'Email must be unique'}};
                    valid = false;
                }
            });
        }

        return valid;
    },

    _isActive: function(event) {
        let item = event && event.model && event.model.item;
        if (!item) { throw 'Cann not get item model!'; }

        this.manageEngagementStaff(item);
    },
    _emailDisabled: function(request, editPopup, emailChecking) {
        return editPopup || request || emailChecking;
    },

    _checkEmail: function(event) {
        if (this.emailChecking) { return; }

        let input = event && event.target,
            value = input && input.value;

        if (value && this._validEmailAddress(input)) {
            this.newEmail = value;
        }
    },

    _showAddButton: function(basePath, agreement, loading) {
        let orgId = agreement && agreement.audit_organization && agreement.audit_organization.id;

        return !!orgId && !loading && this._canBeChanged();
    },

    _showPagination: function(dataItems) {
        return +dataItems && +dataItems > 10;
    },

    _staffLength: function(length, length2, search) {
        let staffLength = search ? length2 : length || length2;
        return staffLength || 0;
    },

    _addStaffFromDialog: function(event) {
        if (this.requestInProcess) { return; }

        if (event && event.detail && event.detail.dialogName === 'deleteConfirm') {
            this.removeStaff();
            return;
        }

        if (!this.validate()) { return; }

        this.requestInProcess = true;

        let item = _.cloneDeep(this.editedItem);
        if (this.canBeRemoved && !isNaN(this.editedIndex)) {
            if (_.isEqual(this.originalEditedObj, this.editedItem)) {
                this.requestInProcess = false;
                this.dialogOpened = false;
                this.resetDialog();
                return;
            }
            this.set('newData', {
                method: 'PATCH',
                data: item,
                staffIndex: this.editedIndex,
                id: `${item.id}/`
            });
        } else {
            this.set('newData', {
                method: 'POST',
                data: item,
                id: ''
            });
        }
    },
    removeStaff: function() {
        this.requestInProcess = true;
        this.set('newData', {
            method: 'DELETE',
            data: {},
            staffIndex: this.editedIndex,
            id: `${this.editedItem.id}/`
        });
        this.confirmDialogOpened = false;
    },
    _staffUpdated: function(event, details) {
        if (!details) { throw 'Detail are not provided!'; }
        if (details.error) {
            this._handleUpdateError(details.errorData);
            return;
        }

        details.data.hasAccess = this.editedItem.hasAccess;
        if (details.action === 'patch') {
            this.manageEngagementStaff(details.data);
            this.splice('dataItems', details.index, 1, details.data);
        } else if (details.action === 'post') {
            this.manageEngagementStaff(details.data);
            this.set('listPage', 0);
            this.set('listPage', 1);
        } else if (details.action === 'delete') {
            let last = this.dataItems.length === 1 ? 1 : 0;
            let email = this.editedItem.user.email;
            this.manageEngagementStaff({user: {email: email}});
            this.set('listQueries', {
                page_size: this.listSize,
                page: this.listPage - last || 1
            });
        }
        this.requestInProcess = false;
        this.dialogOpened = false;
        this.resetDialog();
    },

    manageEngagementStaff: function(staff) {
        if (staff.hasAccess) {
            this.engagementStaffs[staff.user.email] = staff.id;
        } else {
            delete this.engagementStaffs[staff.user.email];
        }
    },
    _handleUpdateError: function(errorData) {
        let error =  this.refactorErrorObject(errorData);
        this.set('errors', error);
        this.requestInProcess = false;
        if (_.isString(error) && ~error.indexOf('required')) {
            this.fire('toast', {text: 'Please, select at least one staff member.'});
        }
    },
    resetList: function() {
        this.set('dataItems', []);
        this.set('listPage', 1);
        this.set('engagementStaffs', {});
        this.set('datalength', 0);
    },
    getTabData: function() {
        if (!this._canBeChanged()) { return null; }
        let staffs = [];
        _.each(this.engagementStaffs, value => {
            staffs.push(value);
        });

        let dataChanged = false;
        if (this.engagement.staff_members.length !== staffs.length) {
            dataChanged = true;
        } else {
            _.each(this.engagement.staff_members, (staff) => {
                if (!~staffs.indexOf(staff.id)) { dataChanged = true; }
            });
        }

        return dataChanged ? staffs : null;
    },

    _getSearchInputClass: function(searchString) {
        if (searchString) { return 'filled'; }
        return 'empty';
    },

    searchBlur: function() {
        this.updateStyles();
    },

    _searchChanged: function() {
        let value = this.$.searchInput.value || '';

        if (value.length - 1) {
            this.debounce('newRequest', () => {
                this.set('searchQuery', value);
            }, 500);
        }
    }

});
