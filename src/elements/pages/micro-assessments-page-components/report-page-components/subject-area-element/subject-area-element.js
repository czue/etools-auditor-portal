'use strict';

Polymer({
    is: 'subject-area-element',
    behaviors: [APBehaviors.StaticDataController],
    properties: {
        area: {
            type: Object,
            notify: true
        }
    },
    observers: ['_setData(area, riskOptions)'],
    ready: function() {
        this.riskOptions = this.getData('riskOptions');
    },
    _setData: function(data) {
        if (!data) { return; }
        if (!data.changed) {
            this.originalData = _.cloneDeep(data);
        }

        if (_.isNumber(data.blueprints[0].risk.value)) {
            this.area.blueprints[0].risk.value = this.riskOptions[this.area.blueprints[0].risk.value];
        }

        if (_.isJSONObj(data.blueprints[0].risk.extra)) {
            data.blueprints[0].risk.extra = JSON.parse(data.blueprints[0].risk.extra);
        } else {
            data.blueprints[0].risk.extra = {comments: (data.blueprints[0].risk.extra && data.blueprints[0].risk.extra.comments) || ''};
        }

        this.areaData = _.clone(this.area.blueprints[0]);
    },
    openEditDialog: function() {
        this.fire('open-edit-dialog', {data: this.area});
    },
    getRiskData: function() {
        if (!this.area.blueprints[0].risk.value) { return null; }
        if (this.area.blueprints[0].risk.value.value === this.originalData.blueprints[0].risk.value &&
            this.area.blueprints[0].risk.extra === this.originalData.blueprints[0].risk.extra) { return null; }

        let risk = {
            extra: this.area.blueprints[0].risk.extra,
            value: this.area.blueprints[0].risk.value.value
        };

        let blueprint = {
            id: this.area.blueprints[0].id,
            risk: risk
        };

        return {
            id: this.area.id,
            blueprints: [blueprint]
        };
    },
    validate: function() {
        return !!this.area.blueprints[0].risk.value && this.area.blueprints[0].risk.extra !== null;
    }
});
