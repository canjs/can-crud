var Component = require("can-component");
var canReflect = require("can-reflect");



module.exports = Component.extend({
	tag: "can-crud-query-filter",
	view: `
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
	`,
	ViewModel: {
		showDropdown: {type: "boolean", default: false},
		get columns(){
			var schema = canReflect.getSchema(this.Type);
			// remove identity keys
			var identity = new Set(schema.identity);

			return Object.keys(schema.keys).filter(function(key){
				return !identity.has(key);
			});
		},
		toggleDropdown: function(){
			this.showDropdown = !this.showDropdown;
		},
		connectedCallback: function(element){
			element.classList.add("row");
		}
	}
});
