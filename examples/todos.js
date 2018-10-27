import realtimeRestModel from "can-realtime-rest-model";
import "can-crud/can-create/can-create";
import DefineMap from "can-define/map/map";
import DefineList from "can-define/list/list";
import fixture from "can-fixture";


var Todo = DefineMap.extend("Todo",{
	id: {identity: true, type: "number"},
	name: "string",
	dueDate: "date",
	complete: "boolean"
});
var TodoList = DefineList.extend("TodoList",{
	"#": Todo
});

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
