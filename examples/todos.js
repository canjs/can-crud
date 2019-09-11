var realtimeRestModel = require("can-realtime-rest-model");
var ObservableObject = require("can-observable-object");
var ObservableArray = require("can-observable-array");
var fixture = require("can-fixture");
var type = require("can-type");

class Todo extends ObservableObject {
	static props = {
		id: {identity: true, type: Number},
		name: String,
		complete: type.maybe( Boolean )
	};
}
class TodoList extends ObservableArray {
	static items = Todo;
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

fixture("/api/todos/{id}", todosStore);

fixture.delay = 500;

module.exports = {Todo, TodoList, todosStore};
