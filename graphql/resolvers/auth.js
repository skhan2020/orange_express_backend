const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')
module.exports = {   // resolver
  createUser: (args) => {
    return User.findOne({email: args.userInput.email})
    .then(user => {
      if (user) {
        throw new Error("user exits already")
      }
      return bcrypt
      .hash(args.userInput.password, 12)
    })
    .then(hashedPW => {
      const user = new User({
        email: args.userInput.email,
        password: hashedPW
     });
     return user.save()
    })
    .then(
      result => {
        return {...result._doc, password: null, _id: result.id};  // id converted explicitly to string here  //  ...result._doc will return only waht we need, leaving metadata information out
      }
    )
    .catch(err =>
      {throw err}
      );
  },
  login: async ({email, password}) => {
    const user = await User.findOne({email: email});
    if (!user) {
      throw new Error("Could not find user!");
    }
    const isSameUser = await bcrypt.compare(password, user.password);
    if (!isSameUser) {
      throw new Error("Incorrect validation!");
    }
    const token = jwt.sign(
      {userId: user.id, email: user.email}, 
      'somesupersecretkey',
      { expiresIn: '1h' });
      return { userId: user.id, token:token, tokenExpiration: 1 }
  }
}