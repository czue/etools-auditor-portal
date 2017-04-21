'use strict';

Polymer({
    is: 'new-engagement-view',
    behaviors: [
        etoolsAppConfig.globals,
        APBehaviors.LastCreatedController
    ],
    properties: {
        engagement: {
            type: Object,
            value: function() {
                return {
                    status: 'partner_contacted',
                    staff_members: [],
                    type: {},
                    attachments: []
                };
            }
        }
    },
    observers: ['_pageChanged(page)'],
    listeners: {
        'main-action-activated': '_saveNewEngagement',
        'engagement-created': '_engagementCreated',
    },
    _allowEdit: function() {
        return true;
    },
    _saveNewEngagement: function() {
        let staffMembersValid = this.$.staffMembers.validate(),
            detailsValid = this.$.engagementDetails.validate();

        if (!staffMembersValid || !detailsValid) {
            this.set('routeData.tab', 'overview');
            this.fire('toast', {text: 'Fix invalid fields before saving'});
            return;
        }
        this.newEngagementData = this._prepareData();
    },
    _prepareData: function() {
        let data = _.cloneDeep(this.engagement);
        data.partner = data.partner.id;
        //TODO: remove this after adding agreement data loading
        data.agreement = 1;

        return {
            type: data.type.link,
            data: data
        };
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
                status: 'partner_contacted',
                staff_members: [],
                type: {}
            };
        }
    },
    _pageChanged: function(page) {
        if (page === 'new') {
            this.set('engagement', {
                status: 'partner_contacted',
                staff_members: [],
                type: {},
                attachments: []
            });
            this.$.engagementDetails.resetValidationErrors();
        }
    }

});
