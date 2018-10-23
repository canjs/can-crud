var Component = require("can-component");
var canReflect = require("can-reflect");

module.exports = Component.extend({
	tag: "can-list",
	view: `
		<table>
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
								<td>{{ record[column] }}</td>
							{{/ for }}
							{{# if( this.canEditOrDestroy ) }}
							<td>
								{{# if( this.edit ) }}
									<button on:click="this.edit(record)">
										Edit
									</button>
								{{/ if }}
								{{# if( this.destroy ) }}
									<button on:click="this.destroy(record)"
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
	`,
	ViewModel: {
		Type: "any",
		edit: "any",
		destroy: "any",

		get recordsPromise(){
			return this.Type.getList({})
		},
		get columns(){
			var schema = canReflect.getSchema(this.Type);
			return Object.keys(schema.keys);
		},
		get canEditOrDestroy(){
			return this.edit || this.destroy;
		},
		prettyName(str) {
			return str.replace(/[a-z][A-Z]/g, function (str) {
					return str.charAt(0) + ' ' + str.charAt(1)
						.toLowerCase();
			});
		}
	}
});
