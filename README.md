# can-crud

[![Build Status](https://travis-ci.org/canjs/can-crud.svg?branch=master)](https://travis-ci.org/canjs/can-crud)

Quickly create CRUD scaffolding for [CanJS](http://canjs.com)!

Create a model like:

```js
import {DefineMap, DefineList, realtimeRestModel} from "can";

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
```

Pass that model to `<can-crud>` in your app:

```html
<can-crud Type:from="this.Todo"/>
```

You'll see something like this:

![crud example](example.png "Crud Example")

You can now view, edit, delete, and create records of your type!
