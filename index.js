const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

//* Import proto file

const PROTO_PATH = path.join(__dirname, './proto/todo.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  
});
const todoProto = grpc.loadPackageDefinition(packageDefinition);
const TodoService = todoProto.TodoService;


const server = new grpc.Server();

const todos = [
    {
      id: 1,
      title: 'Buy groceries',
      content: 'Milk, eggs, bread, and cheese'
    },
    {
      id: 2,
      title: 'Walk the dog',
      content: 'Take Max for a walk in the park'
    },
    {
      id: 3,
      title: 'Read a book',
      content: 'Finish reading "The Great Gatsby"'
    }
  ];


server.addService(TodoService.service, {
       listTodos : (call, callback)=>{
          callback(null, {
            todos : todos
          });
       },
       createTodo: (call, callback)=>{
        let incomingTodo = call.request;
        todos.push(incomingTodo);
        callback(null, incomingTodo);
        
       },
       getTodo: (call, callback)=>{
        let todoId = call.request.id;
        let todo = todos.find(t => t.id === todoId);
        if (todo > 0) {
            callback(null, todo);
        }else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'Todo not found'
            })
        }
       }
});


server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if(err) throw err;
    console.log(`Server listening on port ${port}`);
    // server.start();
});
