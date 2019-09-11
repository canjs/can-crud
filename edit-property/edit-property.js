var canReflect = require("can-reflect");
var stache = require("can-stache");
var StacheElement = require("can-stache-element");
require("can-stache-converters");
var value = require("can-value");
var type = require("can-type");

require("can-debug")();

class CrudOr extends StacheElement {
	static get view() {
		return `
			<div class="row">
			{{# for(option of this.options)}}
				{{{ this.editorForType(option) }}}
			{{/ for}}
			</div>
		`;
	}

	static get props() {
		return {
			value: type.Any,
			schema: type.Any,

			get options(){
				return this.schema.values;
			}
		};
	}

	editorForType(type) {
		return editProperty(this.name, value.bind(this,"value"), type)
	}
}

customElements.define("can-crud-or", CrudOr);

class CanCrudString extends StacheElement {
	static get view() {
		return `
			<input type="text" class="form-control"
				value:from="this.inputValue" on:change="this.value = scope.element.value"/>
		`;
	}

	static get props() {
		return {
			value: type.Any,
			get inputValue(){
				return this.value == null ? "" : ""+this.value;
			}
		};
	}
}

customElements.define("can-crud-string", CanCrudString);

class CanCrudDate extends StacheElement {
	static get view() {
		return `
			<input type="date" class="form-control"
				valueAsDate:from="this.inputValue"
				on:change="this.value = scope.element.valueAsDate"
				/>
		`;
	}

	static get props() {
		return {
			value: type.Any,
			get inputValue(){
				return this.value == null ? null : this.value;
			}
		};
	}
}

customElements.define("can-crud-date", CanCrudDate);

var editMap = new Map([
	[Number, `<input type="number" valueAsNumber:bind="this.value" class="form-control" />`],
	[Boolean, `<input type="radio" class="form-control"/> true <br/> <input type="radio" class="form-control"/> false`],
	[Date, `<can-crud-date value:bind="this.value" class="col-auto"/>`],
	[String, `<can-crud-string value:bind="this.value" class="col-auto"/>`]
]);

// TODO: this should work by type

function editProperty(name, value, Type){
	if(Type) {
		var schema = canReflect.getSchema(Type);
		if(schema) {
			if(schema.type === "Or") {
				var crudOr = new CrudOr().bindings({
					schema: schema,
					value: value,
					name: name
				});
				crudOr.className = "col";
				return crudOr;
			}

		}
	}
	if(canReflect.isPrimitive(Type)) {
		return stache(`<div class='col-auto'><input type="radio" checked:bind="equal(this.value, this.Type)" class="form-check-label">
			<code>{{this.typeName}}</code></div>`)({
				value: value,
				Type: Type,
				typeName: ("" === Type ? "(empty string)" : ""+Type)
			});
	} else {
		var result = editMap.get(Type);
		console.log("rendering", result, value)
		if(typeof result === "string") {
			return stache(result)({value: value});
		}
	}




}

module.exports = editProperty;
