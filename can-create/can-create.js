import DeepObservable from "can-deep-observable";
var Component = require("can-component");
var canReflect = require("can-reflect");
var editProperty = require("../edit-property/edit-property");
var value = require("can-value");


class CanCreate extends StacheElement {
	static get view() {
		return `
			<form on:submit="this.createInstance(scope.event)">
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
				<button disabled:from="instance.isSaving()"
					class="btn btn-primary">Submit</button>
			</form>
		`;
	}

	static get props() {
		return {
			Type: type.Any,
			edit: type.Any,
			destroy: type.Any,

			instance: {
				get default() {
					return new this.Type();
				}
			},

			savePromise: type.Any,

			get columns(){
				var schema = canReflect.getSchema(this.Type);
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
		var schema = canReflect.getSchema(this.Type);
		return editProperty(key,
			value.bind( this.instance, key ), schema.keys[key]);
	}

	createInstance(event) {
		event.preventDefault();
		this.savePromise = this.instance.save();
		this.savePromise.then(function(){
			this.instance = new this.Type();
		}.bind(this));
	}

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-create", CanCreate);

module.exports = CanCreate;
