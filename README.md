# `Orange backend`

The `orange_express_backend` is an express server build to make calls to MongoDB for authentication and resources for the Orange front-end application. Data in fetched from MongoDB Atlas cloud service so running a local database server is not required. 

Try out the application at [demo](https://orangeplanner-32d6f.firebaseapp.com/landing)

The `front-end` code can be found [here](https://github.com/skhan2020/orange_react_frontend).

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- `npm start` to start the local server

The server should start running in port 4000

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [express-graphql](https://github.com/graphql/express-graphql) - To Create a GraphQL HTTP server 

## Application Structure

- `server.js` - The entry point to our application. This file defines the express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `middleware/` - This folder the middleware run on each graphql request to check authentication status.
- `graphql/schemas/` - This folder contains the graphql schema definitions.
- `graphql/resolvers/` - This folder contains the graphql resolvers.
- `models/` - This folder contains the schema definitions for our Mongoose models.

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. A express middleware is defined in `middleware/is-auth.js` that is used to authenticate requests.

<br />
