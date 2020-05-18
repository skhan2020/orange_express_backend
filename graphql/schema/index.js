const {buildSchema} = require('graphql')

module.exports = buildSchema(`
type Todo {
  _id: ID!
  type: String!
  description: String!
  status: String!
  startTime: String
  duration: String
  notes: String
  creator: User!
}
input TodoInput {
  type: String!
  description: String!
  status: String!
  startTime: String
  duration: String
  notes: String
}
type User {
  _id: ID!
  email: String!
  password: String
  createdTodos: [Todo!]
}
input UserInput {
  email: String!
  password: String!
}
type RootQuery {
  todos: [Todo!]
}
type RootMutation {
  createTodo(todoInput: TodoInput): Todo
  createUser(userInput: UserInput): User
}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)