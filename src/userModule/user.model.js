
let mongoose = require("mongoose");
let { hashSync, compareSync } = require("bcrypt-nodejs");
let jwt = require("jsonwebtoken");
let uniqueValidator = require("mongoose-unique-validator");
let constants = require("../config/constants");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required!"]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

UserSchema.plugin(uniqueValidator, {
  message: `{VALUE} already taken! `
});

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
})



UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password)
  },
  authenticateUser(password) {
    console.log('Inside authenticate user');
    console.log(password)
    return compareSync(password, this.password);
  },
  createToken(userId) {
    return jwt.sign({
      _id: userId,
    }, constants.JWTSecret);
  },
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      token: `JWT ${this.createToken(this._id)}`,
    }
  }
}

module.exports = mongoose.model("User", UserSchema);


