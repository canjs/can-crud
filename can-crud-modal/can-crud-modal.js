var Component = require("can-component");

var style = document.createElement("style");
style.innerHTML = `
can-crud-modal .modal {
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
can-crud-modal .modal-content {
    background-color: #fefefe;
    margin: 10% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
}
`;

document.body.appendChild(style);


Component.extend({
	tag: "can-crud-modal",
	view: `
		<div class="modal" on:click="this.closeIfTarget(scope.event)">
			<div class='modal-content'><content/></div>
		</div>
	`,
	ViewModel: {
		close: "any",
		element: "any",
		closeIfTarget: function(event){
			if(event.target === event.currentTarget) {
				this.close();
			}
		}
	}
});
