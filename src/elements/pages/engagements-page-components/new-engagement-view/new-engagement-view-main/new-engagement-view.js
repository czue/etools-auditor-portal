'use strict';

Polymer({
    is: 'new-engagement-view',
    behaviors: [
        etoolsAppConfig.globals,
        APBehaviors.LastCreatedController,
        APBehaviors.EngagementBehavior,
        APBehaviors.StaticDataController,
        APBehaviors.PermissionController
    ],
    properties: {
        engagement: {
            type: Object,
            value: function() {
                return {
                    status: '',
                    staff_members: [],
                    type: {},
                    engagement_attachments: [],
                    agreement: {}
                };
            }
        }
    },
    observers: ['_pageChanged(page)'],
    listeners: {
        'main-action-activated': '_saveNewEngagement',
        'engagement-created': '_engagementCreated',
    },
    ready: function() {
        this.fileTypes = this.getData('engagement_attachments_types');
    },
    _attachmentsReadonly: function() {
        let readOnly = this.isReadonly(`new_engagement.engagement_attachments`);
        if (readOnly === null) { readOnly = true; }
        return readOnly;
    },
    _saveNewEngagement: function() {
        if (!this._validateBasicInfo('routeData.tab')) { return; }

        this._prepareData()
            .then((data) => {
                this.newEngagementData = data;
            });
    },
    _engagementCreated: function(event) {
        if (!event && !event.detail) { return; }
        if (event.detail.success && event.detail.data) {
            //save response data before redirecting
            this._setLastEngagementData(event.detail.data);

            //redirect
            let path = `${this.engagement.type.link}/${event.detail.data.id}/overview`;
            this.set('path', this.getAbsolutePath(path));

            //reset data
            this.engagement = {
                status: '',
                staff_members: [],
                type: {}
            };
        }
    },
    _pageChanged: function(page) {
        if (page === 'new' || page === 'list') {
            this.set('engagement', {
                status: '',
                staff_members: [],
                type: {},
                engagement_attachments: [],
                agreement: {}
            });

            this.$.engagementDetails.resetValidationErrors();
            this.$.partnerDetails.resetValidationErrors();
            this.$.engagementDetails.resetType();
        }
    }

});
