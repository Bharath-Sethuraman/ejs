//jshint esversion:6
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { forEach } = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var postval="";

const app = express();
const PORT = process.env.PORT || 8080;
const _ = require('lodash');
const { default: mongoose } = require("mongoose");
// const { MongoClient } = require('mongodb');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
let item = [];
// mongoose.connect('mongodb+srv://athibharath237:Test123@cluster0.eqpgeeq.mongodb.net/blogDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() =>
// {
//   console.log("Mongoose Connected");
// })
// .catch((err) =>
// {
//   console.log(err);
// })
const postSchema = {
  title: String,
  content: String
}
const Post = mongoose.model("Post", postSchema);
app.get("/",function(req,res){
  Post.find({})
  .then((posts) => {  
    res.render("home",
    {contentejs: homeStartingContent , 
    item: posts});
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutejs: aboutContent})
})
app.get("/contact",function(req,res){
  res.render("contact",{contactejs: contactContent})
})

app.get("/compose",function(req,res){
  res.render("compose");
})
app.post("/compose",function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save()
  .then((result) => {
    console.log('Post saved successfully:', result);
  })
  .catch((error) => {
    console.error('Error saving post:', error);
  });
  item.push(post);
  res.redirect("/");
});

// https://expressjs.com/en/guide/routing.html
app.get('/posts/:postId', (req, res) => {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId})
  .then((post)=>{
    res.render("post",{
      posttitle: post.title,
      postcontent: post.content
    });
  })
  .catch((err) =>
  {
    console.log(err);
  })
});




connectDB().then(() => {
  app.listen(PORT, () => {
      console.log('Listening on port ${PORT}');
  })
});
