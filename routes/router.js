const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const Post = require("../models/postschema");
const mongoose = require('mongoose');
const grid = require("gridfs-stream");
const comment = require("../models/comment");

let gfs, gridfsBucket;
// for user registration
router.post("/register", async (req, res) => {

    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password Not Match" })
        } else {
            const finalUser = new userdb({
                fname, email, password, cpassword
            });

            // here password hasing

            const storeData = await finalUser.save();

            console.log("data on login -> ",storeData);
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }

});




// user Login

router.post("/login", async (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
       const userValid = await userdb.findOne({email:email});

        if(userValid){

            const isMatch = await bcrypt.compare(password,userValid.password);

            if(!isMatch){
                res.status(422).json({ error: "invalid details"})
            }else{

                // token generate
                const token = await userValid.generateAuthtoken();

                // cookiegenerate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error);
        console.log("error: ", error);
    }
});


// check email 

router.post("/check/email", async(req, res)=>{
    const email = req.body.email;
    try{
        const user_exist = await userdb.findOne({email: email});

        if(!user_exist){
            res.status(401).json({error: "Email Doesn't Exist"})
        }
        else{
            console.log("Email exist");
            res.status(201).json({status: 201, response:user_exist});
        }

    }
    catch(error){
        res.status(401).json({status:401, error:error});
        console.log("Catch check email error ", error);
    }
})

// change password

router.post("/change", async (req, res)=>{
    const email = req.body.email;
    const updates = req.body;

    try{
        const updateUser = userdb.findOneAndUpdate({email: email}, updates, {new:true});
        res.status(201).json(updateUser);
    }
    catch(error){
        console.log("Error in change password catch box. ", error);
        res.status(401).json({status:401, error:error});
    }
})

// user valid
router.get("/validuser",authenticate,async(req,res)=>{
    console.log(req.userId);
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
    }
});


// user logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(201).json({status:201})

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})

router.post("/file/upload", upload.single('file'), (req, res) =>{
    try{
        if(!req.file){
            return res.status(401).json({error: "File is missing."});
        }
        const imageUrl = `http://localhost:8009/file/${req.file.filename}`;
        return res.status(201).json({ imageUrl: imageUrl});
    }
    catch(error){
        console.log("Error in router /file/upload, ", error);
        return res.status(401).json({ error: error});
    }
})

router.post("/create", authenticate, async (req, res) =>{
    try{
        const getPost = await new Post(req.body);
        getPost.save();
        return res.status(201).json({ success: "Post Upolad Success" });
    }
    catch(error){
        console.log("Error in /create, ", error);
        return res.status(401).json({ error: "Post not upload" });
    }
})


router.get("/posts",  async (req,  res)=>{
    try{
        let posts = await Post.find({});
        return res.status(201).json(posts);
    }
    catch(error){
        console.log("Error in /create, ", error);
        return res.status(401).json({ error: "Error getting all posts" });
    }
})

const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
});

// get image using filename, got in middleware
router.get('/file/:filename', async (req, res)=>{
    try{
        const file = await gfs.files.findOne({ filename: req.params.filename });
        // const readStream = gfs.createReadStream(file.filename);
        // readStream.pipe(response);
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    }
    catch(error){
        console.log("Error in /file/:filename, ",error);
        res.status(401).json({error: error});
    }
})

// get post by id
router.get("/post/:id", authenticate,  async(req,res)=>{
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        return res.status(201).json(post);
    }
    catch(err){
        console.log("error in /post/:id, ", err);
        return res.status(401).json({error: err});
    }
})


// to update the post
router.put("/update/:id", authenticate, async(req, res)=>{
    try{
        const id = req.params.id;
        const post = await Post.findById(id);
        if(!post){
            return res.status(401).json({err: "Post not found."});
        }
        Post.findByIdAndUpdate(id, req.body, {new:true}, (err, user)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(user);
            }
        })
        return res.status(201).json({success: "Post Update Successfully"});
    }
    catch(err){
        console.log("Error in /update/:id, ", err);
        return res.status(401).json({error: err});
    }
})

// route to delete the post
router.delete("/delete/:id",  async(req, res)=>{
    try{
        const id = req.params.id;
        const post = Post.findById(id);
        if(!post){
            return res.status(401).json({err: "Post Not Found."});
        }
        Post.deleteOne({ _id: id }, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Post deleted successfully');
              return res.status(201).json({success: "Post Deleted"});
            }
          });
    }
    catch(err){
        console.log("Error in delete Post, ", err);
        return res.status(401).json({err:"Post not deleted"});
    }
})

// add new comment

router.post("comments/new", async (request, response) => {
    try {
        const comment = await new Comment(request.body);
        comment.save();

        response.status(201).json('Comment saved successfully');
    } catch (error) {
        response.status(401).json(error);
    }
})


router.get("", async (request, response) => {
    try {
        const comments = await Comment.find({ postId: request.params.id });
        
        response.status(201).json(comments);
    } catch (error) {
        response.status(401).json(error)
    }
})

module.exports = router;



// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true



