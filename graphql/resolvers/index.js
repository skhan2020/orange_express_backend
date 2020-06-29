const todosResolver = require('./todos');
const authResolver = require('./auth');
const statusResolver = require('./status');
const noteResolver = require('./notes');
const videoResolver = require('./videos');

const rootResolver = {
  ...todosResolver,
  ...authResolver,
  ...statusResolver,
  ...noteResolver,
  ...videoResolver,
}

module.exports = rootResolver;
