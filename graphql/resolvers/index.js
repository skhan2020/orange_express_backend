const todosResolver = require('./todos');
const authResolver = require('./auth');
const statusResolver = require('./status');

const rootResolver = {
  ...todosResolver,
  ...authResolver,
  ...statusResolver
}

module.exports = rootResolver;
