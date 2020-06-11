const {buildSchema} = require('graphql')

// all items should have ID
// ID will be applied automatically by graphQL

module.exports = buildSchema(`
type Todo {
  _id: ID!
  category: String!
  title: String!
  projectedStartTime: String!
  projectedEndTime: String!
  status: String!
  statusUpdatedTime: String!
  notes: String
  creator: User!
  tags: [String!]
  createdAt: String!
  updatedAt: String!
}
input TodoInput {
  category: String!
  title: String!
  projectedStartTime: String!
  projectedEndTime: String!
  status: Int!
  statusUpdatedTime: String!
  notes: String
  tags: [String!]
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
type User {
  _id: ID!
  email: String!
  firstName: String
  lastName: String
  type: String
  password: String
  createdTodos: [Todo!]
  createdAt: String!
  updatedAt: String!
}
input UserInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  type: String!
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
  login(email: String!, password:String!, expiration:Int!) : AuthData!
}
type RootMutation {
  createUser(userInput: UserInput): User
  createTodo(todoInput: TodoInput): Todo
  UpdateTodo(todoInput: TodoInput): Todo
  deleteTodo(todoId: ID!): Todo
  updateTodo(id:ID!, projectedStartTime:String, projectedEndTime:String, status:Int, notes:String, statusUpdatedTime: String, tags: [String!]): Todo
  addStatus(statusInput: StatusInput): Status
}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)