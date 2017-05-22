'use strict';

Polymer({
    is: 'summary-engagement',
    behaviors: [
        APBehaviors.DateBehavior,
        APBehaviors.StaticDataController,
        APBehaviors.TableElementsBehavior,
        APBehaviors.PermissionController
    ],
    properties: {
        dataItems: {
            type: Array,
            notify: true
        },
        categoryOfObservation: {
            type: Array,
            value: function() {
                return [];
            }
        },
        mainProperty: {
            type: String,
            value: 'findings'
        },
        itemModel: {
            type: Object,
            value: function() {
                return {
                    category_of_observation: '',
                    deadline_of_action: null,
                    recommendation: ''
                };
            }
        },
        columns: {
            type: Array,
            value: function() {
                return [
                    {
                        'size': 70,
                        'label': 'Subject Area',
                        'path': 'category_of_observation.display_name'
                    },
                    {
                        'size': 25,
                        'label': 'Deadline of Action',
                        'path': 'deadline_of_action'
                    }, {
                        'size': 5,
                        'label': 'Edit',
                        'name': 'edit',
                        'icon': true
                    }
                ];
            }
        },
        details: {
            type: Array,
            value: function() {
                return [{
                    'label': 'Recommendation',
                    'path': 'recommendation',
                    'size': 100
                }];
            }
        },
        addDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Add new Finding'
                };
            }
        },
        editDialogTexts: {
            type: Object,
            value: function() {
                return {
                    title: 'Edit Finding'
                };
            }
        },
        priority: {
            type: Object,
            value: function() {
                return {};
            }
        }
    },

    listeners: {
        'dialog-confirmed': '_addItemFromDialog'
    },

    observers: [
        'resetDialog(dialogOpened)',
        'changePermission(basePermissionPath)',
        '_setPriority(itemModel, priority)',
        '_updateData(dataItems, categoryOfObservation)'
    ],
    _updateData: function(data, categoryOfObservation) {
        _.each(data, (item) => {
            if (item.priority !== this.priority.value) {
                return;
            }
            if (!_.isObject(item.category_of_observation)) {
                categoryOfObservation.filter((category) => {
                    if (category.value === item.category_of_observation) {
                        item.category_of_observation = category;
                    }
                });
            }
        });
    },
    _setPriority: function(itemModel, priority) {
        itemModel.priority = priority.value;
        if (priority.value === 'low') {
            this.customStyle['--ecp-header-bg'] = 'var(--module-warning)';
            this.updateStyles();
        }
    },
    attached: function() {
        this.categoryOfObservation = this.getData('category_of_observation');
    },
    _showFindings: function(item) {
        return this._showItems(item) && item.priority === this.priority.value;
    },
    _getDataLength: function(dataItems) {
        return dataItems.filter((item) => {
            return item.priority === this.priority.value;
        }).length;
    },
    getFindingsData: function() {
        let data = [];
        _.each(this.dataItems, (item) => {
            if (item.priority !== this.priority.value) {
                return;
            }
            if (!item.deadline_of_action) {
                item.deadline_of_action = null;
            }
            if (_.isObject(item.category_of_observation)) {
                let preparedItem = _.cloneDeep(item);
                preparedItem.category_of_observation = item.category_of_observation.value;
                data.push(preparedItem);
            } else {
                data.push(item);
            }
        });
        return data;
    }
});
