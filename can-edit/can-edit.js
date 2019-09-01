import DeepObservable from "can-deep-observable";
var Component = require("can-component");
var canReflect = require("can-reflect");
var editProperty = require("../edit-property/edit-property");
var value = require("can-value");


class CanEdit extends StacheElement {
	static get view() {
		return `
			<form on:submit="this.updateRecord(scope.event)">
				{{# for(column of this.columns) }}
					<div class='form-group'>
						<label>
							{{ this.prettyName( column ) }}
						</label>
						<div class='row'>
							{{{ this.editorForColumn(column) }}}
						</div>
					</div>
				{{/ for }}
				{{# if(this.showSave) }}
					<button disabled:from="this.record.isSaving()">Save</button>
				{{/ if }}
			</form>
		`;
	}

	static get props() {
		return {
			record: type.Any,
			savePromise: type.Any,
			showSave: {default: true},

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
			}
		};
	}

	prettyName(str) {
		return str.replace(/[a-z][A-Z]/g, function (str) {
				return str.charAt(0) + ' ' + str.charAt(1)
					.toLowerCase();
		});
	}

	editorForColumn(key) {
		var schema = canReflect.getSchema(this.record.constructor);
		return editProperty(key,
			value.bind( this.record, key ), schema.keys[key])
	}

	updateRecord(event) {
		event.preventDefault();
		this.savePromise = this.record.save();
	}

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-edit", CanEdit);

module.exports = CanEdit;
