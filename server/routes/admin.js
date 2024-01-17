const express = require("express");
const moment = require("moment");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const middlewareJwt = require("../middleware/middleware");

const adminLayout = "../views/layouts/admin";
const upload = multer({ storage: multer.diskStorage({}) });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//POST Admin- Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const isCurrentUsername = await User.findOne({
      username: req.body.username,
    });
    if (isCurrentUsername) {
      return res.json({ usernameExist: "username already exist" });
    }
    //if there not found any errors create user and Storeg JWT in Cookies
    const newUser = await User.create({ username, password: hashPassword });
    var token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY_JWT);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ id: newUser._id });
  } catch (err) {
    console.log(err);
  }
});

//GET Admin-LogIn Page
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

//POST Admin- Check LogIn
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const logInUser = await User.findOne({ username: req.body.username });
    if (logInUser == null) {
      return res.json({ usernameExist: "username Not Found" });
    } else {
      const match = await bcrypt.compare(req.body.password, logInUser.password);

      if (match) {
        //Email and password is correct
        console.log("username and Password is Correct , Hello My Admin ❤");
        var token = jwt.sign({ id: logInUser._id }, process.env.SECRET_KEY_JWT);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        return res.json({ id: logInUser._id });
      } else {
        console.log("wrong Password");
        return res.json({
          wrongPass: `incorrect password for ${req.body.username} admin 🤷‍♂️`,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

//GET / dashboard Admin
router.get("/dashboard", middlewareJwt.checkIfUser, async (req, res) => {
  try {
    locals = {
      title: "Dashboard Admin",
    };
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("admin/dashboard", {
      data,
      moment,
      locals,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//add post page
router.get("/add-post", middlewareJwt.checkIfUser, async (req, res) => {
  const locals = {
    title: "Add Post",
  };
  res.render("admin/add-post", { locals });
});

//add post to DataBase
router.post(
  "/add-post",
  middlewareJwt.checkIfUser,
  upload.single("avatar"),
  async (req, res) => {
    try {
      cloudinary.uploader.upload(
        req.file.path,
        { folder: "Blog/article" },
        async (error, result) => {
          if (result) {
            // const avatar = await Post.updateOne(
            //   { _id: req.params.id },
            //   { articaleImage: result.secure_url }
            // );
            // res.redirect("/dashboard");
            const newPost = new Post({
              _id: req.params.id,
              articaleImage: result.secure_url,
              title: req.body.title,
              body: req.body.body,
            });

            await Post.create(newPost);
            res.redirect("/dashboard");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
);

//edit post Page
router.get("/edit-post/:id", middlewareJwt.checkIfUser, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//edit post

router.put(
  "/edit-post/:id",
  middlewareJwt.checkIfUser,
  upload.single("avatar"),
  async (req, res) => {
    try {
      cloudinary.uploader.upload(
        req.file.path,
        { folder: "Blog/article" },
        async (error, result) => {
          if (result) {
            await Post.findByIdAndUpdate(req.params.id, {
              title: req.body.title,
              body: req.body.body,
              articaleImage: result.secure_url,
              updatedAt: Date.now(),
            });
          }
        }
      );
      res.redirect(`/post/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
  }
);

//delete post from DataBase
router.delete(
  "/delete-post/:id",
  middlewareJwt.checkIfUser,
  async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/admin");
});

// cloudinary.uploader.upload(
//   req.file.path,
//   { folder: "Blog/article" },
//   async (error, result) => {
//     if (result) {
//       const avatar = await Post.updateOne(
//         { _id: req.params.id },
//         { articaleImage: result.secure_url }
//       );
//       res.redirect("/dashboard");
//     }
//   }
// );

module.exports = router;
