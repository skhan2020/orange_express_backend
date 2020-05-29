const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')
module.exports = {   // resolver
  createUser: (args) => {
    return User.findOne({email: args.userInput.email})
    .then(user => {
      if (user) {
        throw new Error("user_exits")
      }
      return bcrypt
      .hash(args.userInput.password, 12)
    })
    .then(hashedPW => {
      const user = new User({
        email: args.userInput.email,
        type: args.userInput.type,
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        password: hashedPW
     });
     return user.save()
    })
    .then(
      result => {
        // id converted explicitly to string here  
        //  ...result._doc will return only what we need, leaving metadata information out
        return {...result._doc, password: null, _id: result.id,
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString()};  
      }
    )
    .catch(err =>
      {
        throw err
      }
      );
  },
  login: async ({email, password, expiration}) => {
    const milisecondInADay = 24 * 60 * 60 * 1000;
    const user = await User.findOne({email: email});
    if (!user) {
      throw new Error("user_not_found");
    }
    // check trial expiration date
    const createdAt = new Date(user.createdAt);
    if (expiration !== 0) {
      const timePassed = Date.now() - createdAt.getTime();
      const noOfDaysExceeded = timePassed > expiration * milisecondInADay;
      if (noOfDaysExceeded) {
        throw new Error("trial_expired");
      }
    }
    const isSameUser = await bcrypt.compare(password, user.password);
    if (!isSameUser) {
      throw new Error("incorrect_login");
    }
    const token = jwt.sign(
      {userId: user.id, email: user.email}, 
      'somesupersecretkey',
      { expiresIn: '1h' });
      return { userId: user.id, token:token, tokenExpiration: 1 }
  }
}