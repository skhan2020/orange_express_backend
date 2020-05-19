const bcrypt = require('bcryptjs')

const Todo = require('../../models/todo')
const User = require('../../models/user')

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
  return User.findById(userId).then(
    user => {
      return {...user._doc,
        _id: user.id,
        createdTodos: todos.bind(this, user._doc.createdTodos)} // calls the above function
    }
  )
  .catch(err =>
    {throw err;}
  )
}

module.exports = {   // resolver
  todos: () => {
    return Todo.find()
    .then(todos => {
      return todos.map(todo => {
        return {...todo._doc,
                _id: todo.id,
                startTime: new Date(todo._doc.startTime).toISOString(),
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
      startTime: new Date(args.todoInput.startTime),
      duration: args.todoInput.duration,
      notes: args.todoInput.notes,
      creator: req.userId // mongoose automaticaly converst this to an objectID that is used in the DB
   });
   let createdTodo;
   return todo.save()
   .then(
     result => {
       createdTodo = {...result._doc, _id: result.id,
        startTime: new Date(todo._doc.startTime).toISOString(),
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
  }
}