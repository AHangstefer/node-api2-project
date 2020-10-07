const express = require("express");
const { findById } = require("./data/db");
const db = require("./data/db");

const router = express.Router()

router.get("/", (req, res)=> {
    res.json({
        message: "Hey! This is your posts.js"
    })
})



// When the client makes a POST request to /api/posts:
// If the request body is missing the title or contents property:
// cancel the request.
// respond with HTTP status code 400 (Bad Request).
// return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.
// If the information about the post is valid:
// save the new post the the database.
// return HTTP status code 201 (Created).
// return the newly created post.
// If there's an error while saving the post:
// cancel the request.
// respond with HTTP status code 500 (Server Error).
// return the following JSON object: { error: "There was an error while saving the post to the database" }.

router.post("/api/posts", (req, res)=>{

    if (!req.body.title || !req.body.contents){
        return res.status(404).json({
            errorMessage: "Please provide title or contents for the post"
        })
    } 
    db.insert(req.body)
        .then((post)=>{
            res.status(201).json(post)
        })
        .catch((err)=> {
            console.log(err)
            return res.status(500).json({
                message: "Error adding post"
            })
        })
})



// When the client makes a POST request to /api/posts/:id/comments:
//     If the post with the specified id is not found:
//     return HTTP status code 404 (Not Found).
//     return the following JSON object: { message: "The post with the specified ID does not exist." }.
//     If the request body is missing the text property:
//     cancel the request.
//     respond with HTTP status code 400 (Bad Request).
//     return the following JSON response: { errorMessage: "Please provide text for the comment." }.
//     If the information about the comment is valid:
//     save the new comment the the database.
//     return HTTP status code 201 (Created).
//     return the newly created comment.
//     If there's an error while saving the comment:    
//     cancel the request.
//     respond with HTTP status code 500 (Server Error).
//     return the following JSON object: { error: "There was an error while saving the comment to the database" }.

router.post('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = { ...req.body, post_id: id };
    if (!text) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
      } else {
        db.findById(id)
        .then((post) => {
          if (!post.length) {
            res.status(404).json({
              message: 'The post with the specified ID does not exist.',
            });
          } else {
            db.insertComment(comment)
              .then((comment) => {
                db.findCommentById(comment.id)
                .then(comment => {
                  res.status(201).json({comment})
                })
              })
              .catch((error) => {
                res.status(500).json({
                  error:
                    'There was an error while saving the comment to the database',
                });
              });
          }
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  });



       
                
    
    // When the client makes a GET request to /api/posts:
    // If there's an error in retrieving the posts from the database:
    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The posts information could not be retrieved." }.

    router.get("/api/posts", (req, res)=>{
        db.find(req.query)
            .then((posts)=> res.status(200).json(posts))

                .catch((err)=> {
                console.log(err)
                res.status(500).json({
                    error: "The posts information could not be retrieved"
                })
            })
    })
  

// When the client makes a GET request to /api/posts/:id:
    // If the post with the specified id is not found:
    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified
    // ID does not exist." }.
    // If there's an error in retrieving the post from the database:
    
    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The post information could not 
    //be retrieved." }.
    router.get("/api/posts/:id",(req, res)=>{
        id = req.params.id
        db.findById(id)
           
         .then((post)=>{
                if (post.length === 0) {
                    return res.status(404).json({
                        message: "the post with the specified ID doesn't exist"
                    })
                } else {
                    res.status(200).json(post) 
                }
        })
                
            .catch((err)=> {
               console.log(err)
               return res.status(500).json({
                   message: "The post information could not be retrieved"
               })
               
            })
        
  })
    






    // When the client makes a GET request to /api/posts/:id/comments:
    // If the post with the specified id is not found:
    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.
    // If there's an error in retrieving the comments from the database:
    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The comments information could not be retrieved." }.
    router.get("/api/posts/:id/comments", (req, res) => {
       // id = req.params.id
        db.findPostComments(req.params.id)
            .then((comment)=> {
                if (comment){
                    res.status(200).json(comment)
                } else {
                    res.status(404).json({
                        message: "The post with that ID does not exist"
                    })
                }
            })
            .catch((err)=> {
                console.log(err)
                return res.status(500).json({
                    error: "The comment information could not be retrieved "
                })
            })

    })
    
// When the client makes a DELETE request to /api/posts/:id:
    // If the post with the specified id is not found:
    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.
    // If there's an error in removing the post from the database:
    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The post could not be removed" }.

    router.delete("/api/posts/:id", (req, res)=> {
        db.findById(req.params.id)
            .then((post) => {
                if (post) {
                    db.remove(req.params.id)
                        .then(()=>
                            res.status(200).json({
                                message: "Post Deleted"
                            })
                        );
                       
                } else {
                    res.status(404).json({
                        message: "The Post with this specified ID does not exist"
                    })
                }
            })
             .catch((err)=> {
                console.log(err)
                res.status(500).json({
                    errorMessage: "Error with post"
                })

            })
    })





    // When the client makes a PUT request to /api/posts/:id:
    
    // If the post with the specified id is not found:
    
    // return HTTP status code 404 (Not Found).
    // return the following JSON object: { message: "The post with the specified ID does not exist." }.
    // If the request body is missing the title or contents property:
    
    // cancel the request.
    // respond with HTTP status code 400 (Bad Request).
    // return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.
    // If there's an error when updating the post:
    
    // cancel the request.
    // respond with HTTP status code 500.
    // return the following JSON object: { error: "The post information could not be modified." }.
    // If the post is found and the new information is valid:
    
    // update the post document in the database using the new information sent in the request body.
    // return HTTP status code 200 (OK).
    // return the newly updated post.

    router.put('/api/posts/:id', (req, res) => {
        const changes = req.body;
        db.update(req.params.id, changes)
          .then((post) => {
            if (post) {
              res.status(200).json(post);
            } else {
              res.status(404).json({ errorMessage: 'The post could not be found.' });
            }
          })
          .catch(() => {
            res.status(500).json({ errorMessage: 'Error updating post' });
          });
      });






module.exports =router