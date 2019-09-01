import DeepObservable from "can-deep-observable";
var Component = require("can-component");

var style = document.createElement("style");
style.innerHTML = `

`;

document.body.appendChild(style);


class CanCrudModal extends StacheElement {
    static get view() {
        return `
            <div class='modal show' on:click="this.closeIfTarget(scope.event)"
                style="display: block; padding-right: 15px;">
                <div class='modal-dialog'>
                    <div class='modal-content'><content/></div>
                </div>
            </div>
        `;
    }

    static get props() {
        return {
            close: type.Any,
            element: type.Any
        };
    }

    closeIfTarget(event) {
        if(event.target === event.currentTarget) {
            this.close();
        }
    }

    connected() {
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

    static get propertyDefaults() {
        return DeepObservable;
    }
}
customElements.define("can-crud-modal", CanCrudModal);
