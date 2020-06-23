const todosResolver = require('./todos');
const authResolver = require('./auth');
const statusResolver = require('./status');
const noteResolver = require('./notes');

const rootResolver = {
  ...todosResolver,
  ...authResolver,
  ...statusResolver,
  ...noteResolver
}

module.exports = rootResolver;
