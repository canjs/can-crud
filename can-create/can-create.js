var Component = require("can-component");
var canReflect = require("can-reflect");
var editProperty = require("../edit-property/edit-property");
var value = require("can-value");

var style = document.createElement("style");
style.innerHTML = `
can-create .row {
	margin: 1em 0em;
}
`;

document.body.appendChild(style);


module.exports = Component.extend({
	tag: "can-create",
	view: `
		<form on:submit="this.createInstance(scope.event)">
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
			<button>Submit</button>
		</form>
	`,
	ViewModel: {
		Type: "any",
		edit: "any",
		destroy: "any",
		instance: {
			default(){
				return new this.Type();
			}
		},
		savePromise: "any",
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
		},
		prettyName(str) {
			return str.replace(/[a-z][A-Z]/g, function (str) {
					return str.charAt(0) + ' ' + str.charAt(1)
						.toLowerCase();
			});
		},
		editorForColumn(key){
			var schema = canReflect.getSchema(this.Type);
			return editProperty(key,
				value.bind( this.instance, key ), schema.keys[key])
		},

		createInstance(event) {
			event.preventDefault();
			this.savePromise = this.instance.save();
			this.savePromise.then(function(){
				this.instance = new this.Type();
			}.bind(this));
		}
	}
});
