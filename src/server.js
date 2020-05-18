var express = require('express');
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const graphqlSchema = require('../graphql/schema/index')
const graphqlResolvers = require('../graphql/resolvers/index')

const Todo = require ('../models/todo')
const User = require ('../models/user')
var app = express();

app.use(bodyParser.json())

app.use('/graphqlapi', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
}))

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-nc0xa.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri, 
{ useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
 }
).then(
  app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
  })
).catch(
  err => {
    console.log(err)
  }
)