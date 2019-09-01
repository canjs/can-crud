import DeepObservable from "can-deep-observable";
var canReflect = require("can-reflect");
var stache = require("can-stache");
var Component = require("can-component");
require("can-stache-converters");
var value = require("can-value");

require("can-debug")();





class CrudOr extends StacheElement {
	static get view() {
		return `
			{{# for(option of this.options)}}
				{{{ this.editorForType(option) }}}
			{{/ for}}
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

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-crud-or", CrudOr);

class CanCrudString extends StacheElement {
	static get view() {
		return `
			<input type="text" value:from="this.inputValue" on:change="this.value = scope.element.value"/>
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

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-crud-string", CanCrudString);

class CanCrudDate extends StacheElement {
	static get view() {
		return `
			<input type="date" valueAsDate:from="this.inputValue" on:change="this.value = scope.element.valueAsDate"/>
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

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-crud-date", CanCrudDate);

var editMap = new Map([
	[Number, `<input type="number" valueAsNumber:bind="this.value">`],
	[Boolean, `<input type="radio"> true <br/> <input type="radio"> false`],
	[Date, `<can-crud-date value:bind="this.value" />`],
	[String, `<can-crud-string value:bind="this.value"/>`]
]);

// TODO: this should work by type

function editProperty(name, value, Type){
	if(Type) {
		var schema = canReflect.getSchema(Type);
		if(schema) {
			if(schema.type === "Or") {
				return new CrudOr({
					viewModel: {
						schema: schema,
						value: value,
						name: name
					}
				});
			}

		}
	}
	if(canReflect.isPrimitive(Type)) {
		return stache(`<input type="radio" checked:bind="equal(this.value, this.Type)">
			<code>{{this.typeName}}</code>`)({
				value: value,
				Type: Type,
				typeName: ("" === Type ? "(empty string)" : ""+Type)
			});
	} else {
		var result = editMap.get(Type);

		if(typeof result === "string") {
			return stache(result)({value: value});
		}
	}




}

module.exports = editProperty;
