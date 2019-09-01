import realtimeRestModel from "can-realtime-rest-model";
import "can-crud/can-create/can-create";
import ObservableObject from "can-observable-object";
import ObservableArray from "can-observable-array";
import fixture from "can-fixture";
import DeepObservable from "can-deep-observable";


class Todo extends ObservableObject {
    static get props() {
        return {
            id: {identity: true, type: type.maybeConvert(Number)},
            name: type.maybeConvert(String),
            dueDate: type.maybeConvert(Date),
            complete: type.maybeConvert(Boolean)
        };
    }

    static get propertyDefaults() {
        return DeepObservable;
    }
}

class TodoList extends ObservableArray {
    static get props() {
        return {};
    }

    static get items() {
        return type.maybeConvert(Todo);
    }
}

realtimeRestModel({
	Map: Todo,
	List: TodoList,
	url: "/api/todos/{id}"
});

var todosStore = fixture.store([
	{id: 1, name: "wash dishes", dueDate: new Date(2018,1,1), complete: true},
	{id: 2, name: "clean car", dueDate: new Date(2018,3,1), complete: false},
	{id: 3, name: "mow lawn", dueDate: new Date(2018,5,1), complete: null},
	{id: 4, name: "cook food", dueDate: null, complete: true}
], Todo);
fixture.delay = 500;

fixture("/api/todos/{id}", todosStore);

export {Todo, TodoList, todosStore};
