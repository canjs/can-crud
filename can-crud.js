require("./can-create/can-create");
require("./can-list/can-list");
require("./can-edit/can-edit");
require("./can-crud-modal/can-crud-modal");

var Component = require("can-component");
var canReflect = require("can-reflect");

Component.extend({
	tag: "can-crud",
	view: `
		<h1>{{this.Type.name}}s</h1>
		<can-list Type:from="this.Type"
			destroy:from="destroyRecord"
			edit:from="editRecord"/>
		<h2>Create {{this.Type.name}}</h2>
		<can-create Type:from="this.Type"/>

		{{#if this.editingRecord}}
			<can-crud-modal close:from="this.stopEditing">
				<h2>Editing {{this.Type.name}} {{this.editingId}}</h2>
				<can-edit record:from="this.editingRecord"/>
			</can-crud-modal>
		{{/if}}
	`,
	ViewModel: {
		Type: "any",
		editingRecord: "any",

		destroyRecord: function(record){
			if( window.confirm("Do you want to delete this record?") ) {
				record.destroy();
			}
		},
		editRecord: function(record){
			this.editingRecord = record;
		},
		stopEditing: function(){
			this.editingRecord = null
		},
		get editingId(){
			// TODO: check why this is needed
			return this.editingRecord && canReflect.getIdentity(this.editingRecord);
		}
	}
});
