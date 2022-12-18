const bcrypt = require("bcrypt");
const { generate } = require("shortid");
const { generateJwtToken } = require("../helpers");
const { sendMail } = require("../utils/NodeMailer");
const User = require("../models/User");

exports.profile = async(req, res) => {
  const { userName } = req.query;
  const user = await User.findOne({ userName });
  res.send(user);
}

exports.register = async(req, res) => {

  const { firstName, lastName, email, password } = req.body
  const _user = await User.findOne({ email });

    if(_user){
        return res.send({
            success: false,
            exists: true,
            message: "Already registered.",
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      userName: email.split("@")[0],
      email,
      password: hashedPassword,
    });
  
    const user = await newUser.save();

    const token = generateJwtToken(user);
    res.send({
        success: true,
        message: 'Registered successfully'
    });
};

exports.logedIn = async(req, res) => {

  const user = await User.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = generateJwtToken(user);
    const {
      _id,
      email,
      firstName,
      lastName,
      userName,
      _about,
      _inspiration,
      hobbies,
    } = user;
    res.send({
      success: true,
      token,
      message: "Logged in successfully",
      info: {
        _id,
        email,
        firstName,
        lastName,
        userName,
        _about,
        _inspiration,
        hobbies,
      },
    });
  } else {
    res.status(401).send({ message: "Invalid Credentials" });
  }


};

exports.updateProfile = (req, res) =>{
  const { _id } = req.user;
  const { _about, _inspiration, hobbies } = req.body;

  const updates = {
    _about,
    _inspiration,
    hobbies,
  };

  User.findOneAndUpdate(
    { _id },
    { $set: updates },
    { returnOriginal: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          err,
          message: "Something went wrong",
        });
      }

      if (user) {
        const {
          _id,
          email,
          firstName,
          lastName,
          userName,
          _about,
          _inspiration,
          hobbies,
        } = user;
        const token = generateJwtToken(user);
        res.send({
          success: true,
          message: "Updated Successfully",
          token,
          info: {
            _id,
            email,
            firstName,
            lastName,
            userName,
            _about,
            _inspiration,
            hobbies,
          },
        });
      }
    }
  );
}

exports.forgetPasswrd = async(req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if(user){
      // const { _id, email } = user;
      const token = generateJwtToken(user);
      const href = `http://localhost:3000/update-password/${ token }`
        await sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: `Recovery your password`,
            text: 'test text',
            html: `<h1>Reset your password. <a href=${ href }>link</a></h1>`
        });

        return res.send({
            success: true,
            message: "Please check your Email",
        });
  }

  res.send({
    success: false,
    notfound: true,
    message: "Please register first."
  })
};

exports.updatePassword = async(req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const _password = await bcrypt.hash(password, salt);

  User.findOneAndUpdate(
    { _id }, 
    { $set: { password: _password } },
    { returnOriginal: false },
    (err, user)=>{
        if(err){
            return res.status(400).json({
                err,
                message: "Something went wrong",
            });
        }

        if(user){
          return res.send({
            success: true,
            message: "Password updated successfully",
          });
        }
    }
  )
};



