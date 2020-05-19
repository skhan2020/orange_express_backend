const todosResolver = require('./todos');
const authResolver = require('./auth');

const rootResolver = {
  ...todosResolver,
  ...authResolver
}

module.exports = rootResolver;
