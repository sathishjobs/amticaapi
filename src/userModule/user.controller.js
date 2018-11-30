let HTTPStatus = require("http-status");
let UserModal = require("./user.model");


module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModal.findOne({ email });
    if (!user) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: true, field : "email" ,message: "User Not Found" });
    }
    if (!user.authenticateUser(password)) {
      return res.status(HTTPStatus.UNAUTHORIZED).json({ error: true, field : "password", message: "Password is incorrect!" });
    }
    return res.status(HTTPStatus.OK).json(user);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

module.exports.signUp = async (req, res) => {
  try {
    // is user already found
    let existingUser = await UserModal.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(HTTPStatus.CONFLICT).json({ error: 'true', field : "email", message: 'User already found!' });
    return res.status(HTTPStatus.CREATED).json(await UserModal.create(req.body));
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(Error);
  }
}


// sample home route 
module.exports.home = async (req,res) => {
  try {
    return res.status(HTTPStatus.OK).json({message : 'Successfully Reached Home'});
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(Error);
  }
}

//check user already exist or not
module.exports.isUserExist = async (req,res) => {
  try {
    const{email} = req.body;
    const isExist = await UserModal.findOne({email});
    if(isExist){
      return res.status(HTTPStatus.OK).json({
        error : true,
        errorMessage : `User already exist!`
      });
    } 
    return res.status(HTTPStatus.OK).json({
      error : false,
      message : "User does not already exist!"
    })
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}