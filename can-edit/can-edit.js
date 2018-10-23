var Component = require("can-component");
var canReflect = require("can-reflect");
var editProperty = require("../edit-property/edit-property");
var value = require("can-value");

var style = document.createElement("style");
style.innerHTML = `
can-edit .row {
	margin: 1em 0em;
}
`;

document.body.appendChild(style);


module.exports = Component.extend({
	tag: "can-edit",
	view: `
		<form on:submit="this.updateRecord(scope.event)">
			{{# for(column of this.columns) }}
				<div class='row'>
					<label>
						{{ this.prettyName( column ) }}
					</label>
					<div>
						{{{ this.editorForColumn(column) }}}
					</div>
				</div>
			{{/ for }}
			<button disabled:from="this.record.isSaving()">Save</button>
		</form>
	`,
	ViewModel: {
		record: "any",
		savePromise: "any",
		get columns(){
			var schema = canReflect.getSchema(this.record.constructor);
			// remove identity keys
			var identity = new Set(schema.identity);

			return Object.keys(schema.keys).filter(function(key){
				return !identity.has(key);
			});
		},
		get canEditOrDestroy(){
			return this.edit && this.destroy;
		},
		prettyName(str) {
			return str.replace(/[a-z][A-Z]/g, function (str) {
					return str.charAt(0) + ' ' + str.charAt(1)
						.toLowerCase();
			});
		},
		editorForColumn(key){
			var schema = canReflect.getSchema(this.record.constructor);
			return editProperty(key,
				value.bind( this.record, key ), schema.keys[key])
		},

		updateRecord(event) {
			event.preventDefault();
			this.savePromise = this.record.save();
		}
	}
});
