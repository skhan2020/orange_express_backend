const Dataloader = require('dataloader')

const Todo = require('../../models/todo')
const User = require('../../models/user')
const Status = require('../../models/status')

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
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    return Todo.find({creator: req.userId})
    .then(todos => {
      return todos.map(todo => {
        return {...todo._doc,
                _id: todo.id,
                statusUpdatedTime: new Date(todo._doc.statusUpdatedTime).toISOString(),
                projectedEndTime: new Date(todo._doc.projectedEndTime).toISOString(),
                projectedStartTime: new Date(todo._doc.projectedStartTime).toISOString(),
                creator: user.bind(this, todo._doc.creator)}  // creates a new object with out any matadata
      })
    }
    ).catch(err => console.log(err))
  },
  filteredTodos: ({type, filter}, req) => { 
    if (!req.isAuth) {
      throw new Error('Unauthenticated!')
    }
    return Todo.find({[type]: filter})
    .then(todos => {
      return todos.map(todo => {
        return {...todo._doc,
                _id: todo.id,
                statusUpdatedTime: new Date(todo._doc.statusUpdatedTime).toISOString(),
                projectedEndTime: new Date(todo._doc.projectedEndTime).toISOString(),
                projectedStartTime: new Date(todo._doc.projectedStartTime).toISOString(),
                creator: user.bind(this, todo._doc.creator)}  // creates a new object with out any matadata
      })
    }
    ).catch(err => console.log(err))
  },
  updateTodo: async ({id, projectedStartTime, projectedEndTime, status, notes, statusUpdatedTime, tags}, req) => {
    if (!req.isAuth) {
     throw new Error('Unauthenticated!')
    }
    let todo = await Todo.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    let statusChanged = false;
    if (todo.status !== status) {
      statusChanged = true;
    }
    // update with new values
    todo.projectedStartTime = new Date(projectedStartTime) || todo.projectedStartTime;
    todo.projectedEndTime = new Date(projectedEndTime) || todo.projectedEndTime;
    todo.notes = notes || todo.notes;
    todo.tags = tags || todo.tags;
    todo.status = status || todo.status;
    todo.statusUpdatedTime = statusUpdatedTime || todo.statusUpdatedTime;
    let updatedTodo;
    return todo.save()
    .then (
      result => {
        updatedTodo = {...result._doc,
         projectedStartTime: new Date(result._doc.projectedStartTime).toISOString(),
         projectedEndTime: new Date(result._doc.projectedEndTime).toISOString(),
         statusUpdatedTime: new Date(result._doc.statusUpdatedTime).toISOString()
        };
        if (statusChanged) {
          const status = new Status({
            type: result.status,
            todo: todo._id
          });
          return status.save();
        } else {
          return updatedTodo;
        }
      }
    )
    .then(result => {
      return updatedTodo;
    })
    .catch(err => {
      throw new Error("could_not_update_todo", err);;
    })
  },
  createTodo: (args, req) => {
   if (!req.isAuth) {
    throw new Error('Unauthenticated!')
   }
   const todo = new Todo({
      category: args.todoInput.category,
      title: args.todoInput.title,
      status: args.todoInput.status,
      statusUpdatedTime: new Date(args.todoInput.statusUpdatedTime),
      projectedStartTime: new Date(args.todoInput.projectedStartTime),
      projectedEndTime: new Date(args.todoInput.projectedEndTime),
      notes: args.todoInput.notes,
      tags: args.todoInput.tags,
      creator: req.userId // mongoose automaticaly converst this to an objectID that is used in the DB
   });
   let createdTodo;
   // mongoose function to save to database
   return todo.save()
   .then(
     result => {
       createdTodo = {...result._doc, _id: result.id,
        projectedStartTime: new Date(result._doc.projectedStartTime).toISOString(),
        projectedEndTime: new Date(result._doc.projectedEndTime).toISOString(),
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
   .then(res =>
      {
        const status = new Status({
          type: 1000,
          todo: createdTodo._id
        });
        return status.save();
      }
    )
   .then(result => {
    return createdTodo;
   })
   .catch(err => console.log(err));
  },
  deleteTodo: async (args, req) => {
    if (!req.isAuth) {
     throw new Error('Unauthenticated!')
    }
    try {
      const deletedTodo = await Todo.findByIdAndDelete(args.todoId).populate('todo');
      if (!deletedTodo) {
        throw new Error("todo_delete_not_found")
      }
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("user_not_found")
      }
      user.createdTodos.pop(args.todoId)
      await user.save();
      await Status.deleteMany({todo: {$in: args.todoId}}).populate('status');
      return deletedTodo._id;
    } catch(err) {
      throw err; 
    }
  }
}