const Dataloader = require('dataloader')

const Todo = require('../../models/todo')
const User = require('../../models/user')

const todoLoader = new Dataloader((todoIds) => {
  return todos(todoIds)
})

const userLoader = new Dataloader(userIds => {
  // userIds are list of objects 
  // not string like you would expect
  return User.find({_id: {$in: userIds}})
})

const todos = todoIds => {
  return Todo.find({_id: {$in: todoIds}})
  .then(todos => {
    return todos.map(todo => {
      return {...todo._doc, _id: todo.id,
        creator: user.bind(this, todo.creator)} // call teh below function
    })
  })
  .catch(err =>
    {throw err})
}

const user = userId => {
  return userLoader.load(userId.toString()).then(
    user => {
      console.log(user)
      return {...user._doc,
        _id: user.id,
        createdTodos: () => todoLoader.loadMany(user._doc.createdTodos)} // calls the above function
    }
  )
  .catch(err =>
    {throw err;}
  )
}

module.exports = {   // resolver
  todos: (args, req) => {
    return Todo.find({creator: req.userId})
    .then(todos => {
      return todos.map(todo => {
        return {...todo._doc,
                _id: todo.id,
                statusUpdatedTime: new Date(todo._doc.statusUpdatedTime).toISOString(),
                projectedStartTime: new Date(todo._doc.projectedStartTime).toISOString(),
                creator: user.bind(this, todo._doc.creator)}  // creates a new object with out any matadata
      })
    }
    ).catch(err => console.log(MediaError))
  },
  createTodo: (args, req) => {
   if (!req.isAuth) {
    throw new Error('Unauthenticated!')
   }
   const todo = new Todo({
      type: args.todoInput.type,
      description: args.todoInput.description,
      status: args.todoInput.status,
      statusUpdatedTime: new Date(args.todoInput.statusUpdatedTime),
      projectedStartTime: new Date(args.todoInput.projectedStartTime),
      notes: args.todoInput.notes,
      creator: req.userId // mongoose automaticaly converst this to an objectID that is used in the DB
   });
   let createdTodo;
   // mongoose function to save to database
   return todo.save()
   .then(
     result => {
       createdTodo = {...result._doc, _id: result.id,
        projectedStartTime: new Date(result._doc.projectedStartTime).toISOString(),
        statusUpdatedTime: new Date(result._doc.statusUpdatedTime).toISOString(),
        creator: user.bind(this, result._doc.creator)};
       return User.findById(req.userId)
     }
   )
   .then(user =>
    {
      if (!user) {
        throw new Error("user not found")
      }
      user.createdTodos.push(todo)
      return user.save();
    })
   .then(result => {
    return createdTodo;
   })
   .catch(err => console.log(err));
  },
  deleteTodo: async args => {
    try {
      await Todo.findByIdAndDelete(args.todoId).populate('todo');
    } catch(err) {
      throw err; 
    }
  }
}