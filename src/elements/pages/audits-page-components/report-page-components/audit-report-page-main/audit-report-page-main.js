'use strict';

Polymer({
    is: 'audit-report-page-main',
    properties: {
        engagement: {
            type: Object,
            notify: true
        }
    },
    validate: function() {
        let assignTabValid = Polymer.dom(this.root).querySelector('#assignEngagement').validate();

        return assignTabValid;
    },
    getAssignVisitData: function() {
        return this.$.assignEngagement.getAssignVisitData();
    },
    getFinancialFindingsData: function() {
        return this.$.financialFindings.getTabData();
    }
});
