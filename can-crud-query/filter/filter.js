import DeepObservable from "can-deep-observable";
var Component = require("can-component");
var canReflect = require("can-reflect");



class CanCrudQueryFilter extends StacheElement {
	static get view() {
		return `
			<div class="dropdown">
				<button class="btn btn-primary dropdown-toggle"
					type="button" id="dropdownMenuButton" data-toggle="dropdown"
					on:click="this.toggleDropdown()">
					+
				</button>
				<div class="dropdown-menu" aria-labelledby="dropdownMenuButton"
					{{#if( this.showDropdown )}}style="display:block"{{/if}}
					>
					<form class="px-4 py-3">
						<div class="form-group">
							<label>Field</label>
							<select class="form-control">
								{{# for(column of this.columns) }}
									<option>{{ column }}</option>
								{{/ for }}
							</select>
						</div>
					</form>
				</div>
			</div>
		`;
	}

	static get props() {
		return {
			showDropdown: {type: type.maybeConvert(Boolean), default: false},

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

	toggleDropdown() {
		this.showDropdown = !this.showDropdown;
	}

	connected() {
		this.classList.add("row");
	}

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-crud-query-filter", CanCrudQueryFilter);


module.exports = CanCrudQueryFilter;
