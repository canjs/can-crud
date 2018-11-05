require("./can-create/can-create");
require("./can-list/can-list");
require("./can-edit/can-edit");
require("./can-crud-modal/can-crud-modal");
require("./can-crud-query/can-crud-query");

var Component = require("can-component");
var canReflect = require("can-reflect");

Component.extend({
	tag: "can-crud",
	view: `
		<h1>{{this.Type.name}}s</h1>
		<!--<div class='bg-light'>
			<can-crud-query Type:from="this.Type"/>
		</div>-->
		<can-list Type:from="this.Type"
			destroy:from="destroyRecord"
			edit:from="editRecord"/>
		<h2>Create {{this.Type.name}}</h2>
		<can-create Type:from="this.Type"/>

		{{#if this.editingRecord}}
			<can-crud-modal close:from="this.stopEditing">
				<div class="modal-header">
					<h3 class="modal-title" id="exampleModalLabel">Editing {{this.Type.name}} {{this.editingId}}</h3>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"
						on:click="this.stopEditing()">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<can-edit record:from="this.editingRecord" showSave:from="false"/>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal"
						on:click="this.stopEditing()">Close</button>
					<button type="button" class="btn btn-primary"
						on:click="this.editingRecord.save()">
						{{# if(this.editingRecord.isSaving()) }}
							Saving...
						{{ else }}
							Save changes
						{{/ if }}
					</button>
				</div>
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
			console.log("EDIT");
			this.editingRecord = record;
		},
		stopEditing: function(){
			this.editingRecord = null;
		},
		get editingId(){
			// TODO: check why this is needed
			return this.editingRecord && canReflect.getIdentity(this.editingRecord);
		}
	}
});
