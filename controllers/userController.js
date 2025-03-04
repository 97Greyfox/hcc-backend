const { User } = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploads } = require("../confg/avatarMulterConfg.js");
const { uploadOnCloudinary } = require("../confg/cloudinaryConfig.js");

const addUser = async (req, res) => {
  try {
    const {
      role,
      title,
      firstName,
      secondName,
      address1,
      address2,
      zipCode,
      phone,
      cell,
      email,
      username,
      city,
      state,
    } = req.body;

    const user = await User.findOne({ username, email });
    if (user) {
      return res
        .status(409)
        .json({
          message: "User already exist no need to signup",
          success: false,
        });
    }

    let { password } = req.body;
    try {
      const salt = await bcrypt.genSalt(15);
      password = await bcrypt.hash(password, salt);
      console.log("hashing successful", password);
    } catch (error) {
      next(error);
    }

     console.log(req.file);
    // console.log(req.file);
    var avatar;
    if(req.file){
      avatar = req.file.path;
    }else{
      avatar = '';
      console.log("in else", req.file);
    }
    console.log(avatar);
    
    const newUser = await new User({
      role,
      title,
      firstName,
      secondName,
      address1,
      address2,
      zipCode,
      phone,
      cell,
      email,
      username,
      password,
      city,
      state,
      avatar: avatar,
    }).save();

    // await newUser.save();

    console.log(newUser);

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
  const user = await User.findOne({username});
    if (!user){
      return res.status(403).json({message:'Authentication Failed no such user',success: false });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual){
      return res.status(403).json({message:'incorrect password',success: false });
    }
    const jwtToken = jwt.sign({ _id:user.id, username:user.username}, process.env.JWT_SECRET, {expiresIn:'24h'})
    return res.status(200).json({message:'User logged In',success: true, jwtToken, name: (user.firstName +user.secondName), username, user,  });
  } catch (error) {
    res.status(500).json({ message: 'Error logging In', error: error.message });
  }
try {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(403)
      .json({
        message: "Authentication Failed no such user",
        success: false,
      });

  }

  const isPassEqual = await bcrypt.compare(password, user.password);
  if (!isPassEqual) {
    return res
      .status(403)
      .json({ message: "incorrect password", success: false });
  }
  const jwtToken = jwt.sign(
    { _id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return res
    .status(200)
    .json({
      message: "User logged In",
      success: true,
      jwtToken,
      name: user.firstName + user.secondName,
      username,
      user,
    });
} catch (error) {
  res.status(500).json({ message: "Error logging In", error: error.message });
}
};
 
    

const modifyUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const updateData = req.body;
    let Flag;
    if (typeof updateData.newPasswordFlag === "string") {
      Flag =
        updateData.newPasswordFlag == "true"
          ? true
          : updateData.newPasswordFlag == "false"
          ? false
          : undefined;
    }

    if (Flag) {
      console.log(updateData.password);
      let password = updateData.password;
      if (!password) {
        return res.status(404).json({ message: "Enter New Password" });
      }

      try {
        const salt = await bcrypt.genSalt(15);
        password = await bcrypt.hash(password, salt);
        console.log("hashing successful", password);
        //   const userUpdatePassword = await User.findByIdAndUpdate( _id , { password: newPassword }, {
        //   new: true,
        //   runValidators: true,
        // });
        updateData.password = password;
      } catch (error) {
        res
          .status(500)
          .json({
            message: "Error updating user password",
            error: error.message,
          });
      }
    }
    if (!Flag) {
      delete updateData.password;
    }

    const avatar = req.file;
    // console.log(avatar);
    let avatarUrl;
    if (avatar) {
      avatarUrl = avatar.path;
    }


    console.log(updateData);

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateData, avatar: avatarUrl },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // if(req.file){
    //   updatedUser.avatar = req.file.path;
    // }

    await updatedUser.save();

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(_id);
    console.log(deletedUser);
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

async function getAllUsers(req, res) {
  const users = await User.find(
    {},
    {
      password: 0,
      __v: 0,
    }
  );
  return res.send(users);
}

async function getUserById(req, res) {
  const id = req.params._id;
  const user = await User.find(
    { id },
    {
      password: 0,
      __v: 0,
    }
  );
  return res.send(user);
}

// async function getUserByFilter(req, res){
//   const {
//     role,
//     firstName,
//     zipCode,
//     phone,
//     email,
//     username,
//     city,
//     state,
//   } = req.query;
//   let user;
//   if (city) {
//     user = await User.find({$regex: city, $options: "i"},{
//       password: 0,
//       __v: 0,
//     });
//   }else if(state){
//     user = await User.find({$regex: state, $options: "i"}, {
//       password: 0,
//       __v: 0,
//     });
//   }else if(zipCode) {
//     user = await User.find({$regex: zipCode, $options: "i"}, {
//       password: 0,
//       __v: 0,
//     });
//   }
//   else if(username) {
//     user = await User.find({$regex: username, $options: "i"}, {
//       password: 0,
//       __v: 0,
//     });
//   }else if(email) {
//     user = await User.find({$regex: email, $options: "i"}, {
//       password: 0,
//       __v: 0,
//     });
//   }else if(phone) {
//     user = await User.find({$regex: phone, $options: "i"}, {
//       password: 0,
//       __v: 0,
//     });
//   }else if(role) {
//     user = await User.find({$regex: role, $options: "i"}, {
//       password: 0,
//       __v: 0,
//     });
//   }else if(firstName) {
//     user = await User.find({$regex: firstName, $options: "i"}, {
//       password: 0,
//       __v: 0,
//     });
//   }else{
//     return res.send('incorrect query');
//   }
//   return res.send(user);
// }


async function getUserByFilter(req, res) {
  try {
    const { role, Name, zipCode, phone, email, username, city, state } = req.query;
    const query = {};

    Object.entries({ role, firstName:Name, zipCode, phone, email, username, city, state }).forEach(([key, value]) => {
      if (value) {
        query[key] = { $regex: value, $options: "i" }; 
      }
    });
    if (Object.keys(query).length === 0) {
      return res.status(400).send("No valid query parameters provided.");
    }
    const users = await User.find(query, { password: 0, __v: 0 });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send("An error occurred while searching for users.");
  }
}




const uploadAvatar = async (req, res) => {
  uploads(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      return res.status(200).json({
        message: "Avatar uploaded successfully",
        avatarUrl: user.avatar,
      });
    } catch (error) {
      console.error("Error updating user avatar:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
};

const setNewPassword = async (req, res, next) => {
  const _id = req.params.id;
  const passwordChangeFlag = req.body.newPasswordFlag;
  let newPassword = req.body.newPassword;
  if (passwordChangeFlag) {
    console.log(newPassword);
    if (!newPassword) {
      return res.status(404).json({ message: "Enter New Password" });
    }

    try {
      const salt = await bcrypt.genSalt(15);
      newPassword = await bcrypt.hash(newPassword, salt);
      console.log("hashing successful", newPassword);
      const userUpdatePassword = await User.findByIdAndUpdate(
        _id,
        { password: newPassword },
        {
          new: true,
          runValidators: true,
        }
      );

      await userUpdatePassword.save();
      res
        .status(200)
        .json({
          message: "User password updated successfully",
          user: userUpdatePassword.password,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error updating user password",
          error: error.message,
        });
    }
  }
};

module.exports = {
  addUser,
  modifyUser,
  deleteUser,
  userLogin,
  getAllUsers,
  getUserById,
  uploadAvatar,
  setNewPassword,
  getUserByFilter,
};
