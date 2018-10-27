var Component = require("can-component");

var style = document.createElement("style");
style.innerHTML = `

`;

document.body.appendChild(style);


Component.extend({
	tag: "can-crud-modal",
	view: `
		<div class='modal show' on:click="this.closeIfTarget(scope.event)"
			style="display: block; padding-right: 15px;">
			<div class='modal-dialog'>
				<div class='modal-content'><content/></div>
			</div>
		</div>
	`,
	ViewModel: {
		close: "any",
		element: "any",
		closeIfTarget: function(event){
			if(event.target === event.currentTarget) {
				this.close();
			}
		},
		connectedCallback: function(el) {
			document.body.classList.add("modal-open");
			var div = document.createElement("div");

			div.className = "modal-backdrop fade show";
			document.body.appendChild(div);

			return function(){
				document.body.removeChild(div);
				this.stopListening();
				document.body.classList.remove("modal-open");
			}.bind(this);
		}
	}
});
