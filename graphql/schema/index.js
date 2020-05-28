const {buildSchema} = require('graphql')

// all items should have ID
// ID will be applied automatically by graphQL

module.exports = buildSchema(`
type Todo {
  _id: ID!
  type: String!
  description: String!
  projectedStartTime: String!
  status: String!
  statusUpdatedTime: String!
  notes: String
  creator: User!
}
input TodoInput {
  type: String!
  description: String!
  projectedStartTime: String!
  status: Int!
  statusUpdatedTime: String!
  notes: String
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
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
type Status {
  _id: ID!
  type: Int!
  todo: Todo!
  createdAt: String!
  updatedAt: String!
}
input StatusInput {
  type: Int!
  todoId: String!
}
type RootQuery {
  todos: [Todo!]
  statuses(todo: String!): [Status!]
  login(email: String!, password:String!) : AuthData!
}
type RootMutation {
  createUser(userInput: UserInput): User
  createTodo(todoInput: TodoInput): Todo
  deleteTodo(todoId: ID!): Todo
  updateTodo(todoId: ID!): Todo
  addStatus(statusInput: StatusInput): Status
}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)