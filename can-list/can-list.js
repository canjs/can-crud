import DeepObservable from "can-deep-observable";
var Component = require("can-component");
var canReflect = require("can-reflect");

function getPrettyValue(value, key, Type){
	if( canReflect.isPrimitive(value) ) {
		return value === null ? ""+value : value;
	}
	if(value instanceof Date) {
		return value.toLocaleString();
	}
	return value;
}


class CanList extends StacheElement {
	static get view() {
		return `
			<table class="table">
				<thead>
					<tr>
						{{# for(column of this.columns) }}
							<th>{{ this.prettyName( column ) }}</th>
						{{/ for }}
						{{# if( this.canEditOrDestroy ) }}
							<th></th>
						{{/ if }}
					</tr>
				</thead>
				<tbody>
					{{# if(recordsPromise.isPending) }}
						<tr><td colspan="{{this.columns.length}}">Loading</td></tr>
					{{/ if }}
					{{# if(recordsPromise.isResolved) }}
						{{# for(record of recordsPromise.value) }}
							<tr>
								{{# for(column of columns) }}
									<td>{{ this.prettyValue( record[column], column ) }}</td>
								{{/ for }}
								{{# if( this.canEditOrDestroy ) }}
								<td>
									{{# if( this.edit ) }}
										<button class="btn btn-secondary btn-sm"
											on:click="this.edit(record)">
											Edit
										</button>
									{{/ if }}
									{{# if( this.destroy ) }}
										<button class="btn btn-danger btn-sm"
											on:click="this.destroy(record)"
											disabled:from="record.isDestroying()">
											{{# if( record.isDestroying() ) }}
												destroying
											{{ else }}
												Delete
											{{/ if }}
										</button>
									{{/ if }}
								</td>
								{{/ if }}
							</tr>
						{{ else }}
							<tr><td colspan="{{this.columns.length}}">No records</td></tr>
						{{/ for }}
					{{/ if }}
				</tbody>
			</table>
		`;
	}

	static get props() {
		return {
			Type: type.Any,
			edit: type.Any,
			destroy: type.Any,

			get recordsPromise(){
				return this.Type.getList({})
			},

			get columns(){
				var schema = canReflect.getSchema(this.Type);
				return Object.keys(schema.keys);
			},

			get canEditOrDestroy(){
				return this.edit || this.destroy;
			}
		};
	}

	prettyName(str) {
		return str.replace(/[a-z][A-Z]/g, function (str) {
				return str.charAt(0) + ' ' + str.charAt(1)
					.toLowerCase();
		});
	}

	prettyValue(value, key) {
		var schema = canReflect.getSchema(this.Type);
		var Type = schema.keys[key];
		return getPrettyValue(value, key, Type);
	}

	static get propertyDefaults() {
		return DeepObservable;
	}
}

customElements.define("can-list", CanList);

module.exports = CanList;
