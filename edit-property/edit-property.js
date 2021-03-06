var canReflect = require("can-reflect");
var stache = require("can-stache");
var Component = require("can-component");
require("can-stache-converters");
var value = require("can-value");

require("can-debug")();

var CrudOr = Component.extend({
	tag: "can-crud-or",
	view: `
		<div class="row">
		{{# for(option of this.options)}}
			{{{ this.editorForType(option) }}}
		{{/ for}}
		</div>
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
		<input type="text" class="form-control"
			value:from="this.inputValue" on:change="this.value = scope.element.value"/>
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
		<input type="date" class="form-control"
			valueAsDate:from="this.inputValue"
			on:change="this.value = scope.element.valueAsDate"
			/>
	`,
	ViewModel: {
		value: "any",
		get inputValue(){
			return this.value == null ? null : this.value;
		}
	}
});

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
				var crudOr = new CrudOr({
					viewModel: {
						schema: schema,
						value: value,
						name: name
					}
				});
				crudOr.element.className = "col";
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

		if(typeof result === "string") {
			return stache(result)({value: value});
		}
	}




}

module.exports = editProperty;
