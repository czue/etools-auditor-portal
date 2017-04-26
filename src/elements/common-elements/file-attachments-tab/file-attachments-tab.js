'use strict';

Polymer({
    is: 'file-attachments-tab',
    properties: {
        fileTypes: {
            type: Array,
            value: function() {
                return [{name: 'test type', id: 8}];
            }
        },
        files: {
            type: Array,
            value: function() {
                return [];
            }
        },
        title: {
            type: String,
            value: 'Attachments'
        },
        readonly: {
            type: Boolean
        },
        allowDownload: {
            type: Boolean
        },
        allowChange: {
            type: Boolean
        },
        allowDelete: {
            type: Boolean
        },
        fileCheckboxVisible: {
            type: Boolean,
            value: false
        },
        fileCheckboxTitle: {
            type: String
        },
        fileCheckboxLabel: {
            type: String
        }
    },
    _hideEmptyState: function(length) { return length > 0;},
    getFiles: function() {
        return this.$.filesElement.getFiles();
    }
});
