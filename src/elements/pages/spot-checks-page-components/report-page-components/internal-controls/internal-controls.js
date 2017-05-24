'use strict';

Polymer({
    is: 'internal-controls',
    behaviors: [
        APBehaviors.PermissionController
    ],
    _setRequired: function(field) {
        if (!this.basePermissionPath) { return false; }

        let required = this.isRequired(`${this.basePermissionPath}.${field}`);

        return required ? 'required' : false;
    },
    _resetFieldError: function(event) {
        event.target.invalid = false;
    },
    getInternalControlsData: function() {
        return this.data.internal_controls;
    }
});
