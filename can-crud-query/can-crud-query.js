import DeepObservable from "can-deep-observable";
var Component = require("can-component");
var canReflect = require("can-reflect");



class CanCrudQuery extends StacheElement {
	static get view() {
		return `
			<div class='col'>
				<div class="input-group mr-sm-2">
					<div class="input-group-prepend">
						<div class="input-group-text">Sort</div>
					</div>
					<select class="form-control">
						{{# for(column of this.columns) }}
							<option>{{ column }}</option>
						{{/ for }}
					</select>
				</div>
			</div>
			{{# for(column of this.columns) }}
				<div class='col'>
					<label>
						{{ column }}
					</label>
				</div>
			{{/ for }}
		`;
	}

	static get props() {
		return {
			get columns(){
				var schema = canReflect.getSchema(this.Type);
				// remove identity keys
				var identity = new Set(schema.identity);

				return Object.keys(schema.keys).filter(function(key){
					return !identity.has(key);
				});
			}
		};
	}

	connected() {
		this.classList.add("row");
	}

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-crud-query", CanCrudQuery);

module.exports = CanCrudQuery;
