var canReflect = require("can-reflect");
var stache = require("can-stache");
var Component = require("can-component");
require("can-stache-converters");
var value = require("can-value");

require("can-debug")();





var CrudOr = Component.extend({
	tag: "can-crud-or",
	view: `
		{{# for(option of this.options)}}
			{{{ this.editorForType(option) }}}
		{{/ for}}
	`,
	ViewModel: {
		value: "any",
		schema: "any",
		get options(){
			return this.schema.values;
		},
		editorForType(type){
			return editProperty(this.name, value.bind(this,"value"), type)
		}
	}
});

Component.extend({
	tag: "can-crud-string",
	view: `
		<input type="text" value:from="this.inputValue" on:change="this.value = scope.element.value"/>
	`,
	ViewModel: {
		value: "any",
		get inputValue(){
			return this.value == null ? "" : ""+this.value;
		}
	}
});

Component.extend({
	tag: "can-crud-date",
	view: `
		<input type="date" valueAsDate:from="this.inputValue" on:change="this.value = scope.element.valueAsDate"/>
	`,
	ViewModel: {
		value: "any",
		get inputValue(){
			return this.value == null ? null : this.value;
		}
	}
});

var editMap = new Map([
	[undefined, `<input type="radio" checked:bind="equal(this.value, undefined)"> <code>undefined</code>`],
	[null, `<input type="radio" checked:bind="equal(this.value, null)"> <code>null</code>`],
	[Number, `<input type="number" valueAsNumber:bind="this.value">`],
	[Boolean, `<input type="radio"> true <br/> <input type="radio"> false`],
	[true, `<input type="radio" checked:bind="equal(this.value, true)"> <code>true</code>`],
	[false, `<input type="radio" checked:bind="equal(this.value, false)"> <code>false</code>`],
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
	var result = editMap.get(Type);

	if(typeof result === "string") {
		return stache(result)({value: value});
	}



}

module.exports = editProperty;
