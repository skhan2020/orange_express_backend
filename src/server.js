var express = require('express');
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const graphqlSchema = require('../graphql/schema/index')
const graphqlResolvers = require('../graphql/resolvers/index')
const isAuth = require('../middleware/is-auth')

var app = express();

app.use(bodyParser.json());

app.use(( req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // preflight request to check with the servers if these
  // methods are allowed on the particular resource
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next();
})

// will run this middleware on every incoming request to the 
// graphql endpoint
app.use(isAuth);

// a middleware that will funnel all API request 
// to graphql schemas and resolvers
// http://localhost:4000/graphqlapi?
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