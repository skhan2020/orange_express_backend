const Status = require('../../models/status.js')

module.exports = {   // resolver
  statuses: async ({ todo }, req) => {
    if (!req.isAuth) {
     throw new Error('Unauthenticated!')
    }
    try {
      const statuses = await Status.find({todo: todo});
      return statuses.map(status => {
        return {
            ...status._doc,
            id: status._id,
            createdAt: new Date(status._doc.createdAt).toISOString(),
          }
        }
      )
    } catch (err) {
      throw err;
    }
  },
  addStatus: async (args, req) => {
    if (!req.isAuth) {
     throw new Error('Unauthenticated!')
    }
    const status = new Status({
       type: args.statusInput.type,
       todo: args.statusInput.todoId
    });
    const result = await status.save();
    return {
      ...result._doc,
      _id: result.id
    }
  }
}