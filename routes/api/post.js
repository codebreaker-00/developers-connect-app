const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validatePostInput = require('../../validation/post');

const Post = require('../../models/Post');

router.get('/test', passport.authenticate('jwt', {session:false}),
            (req,res) => {
            res.json(req.user)}
);

// @ route - Private : api/post
// Post Request to make a "Post" on the WebApp
router.post(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req,res) => {

        const {errors, isValid} = validatePostInput(req.body);

        if(!isValid)
        {
            return res.status(400).json(errors);
        }

        const newPost  = new Post({
            user : req.user.id,
            text : req.body.text,
            name : req.body.name,
            avatar : req.body.avatar
        });

        newPost.save().then(post => res.json(post));
})

// @route - Public : api/post/:id
// Get post by ID
router.get(
    '/:id',
    (req,res) => {
        Post.findById(req.params.id)
            .then(post => {
                res.json(post);
            })
            .catch(err => res.status(404).json({post : 'Post Not FOund'}));
})

//@route - Private : api/post/:id
// Delete - Post by using an ID
router.delete(
    '/:id', passport.authenticate('jwt', {session:false}),
    (req,res) => {
        const errors = {};
        Post.findById(req.params.id)
            .then( post => {
                if(post.user != req.user.id)
                {
                    errors.authentication = 'You do not have Permission to delete this Post';
                    res.status(401).json(errors);
                }
                else
                {
                    post.remove().then( () => res.json({sucess : true}));
                }
            } )
            .catch(err => res.json(err));
})


// @route - Public : api/post/
// Get list of all posts present in the Platform
router.get(
    '/',
    (req,res) => {
        Post.find()
            .then(posts => res.json(posts));
})

// @route - Private : api/post/like/:id
// Post request to Like a post and also to remove like if it has been already liked
router.post(
    '/like/:id',
    passport.authenticate('jwt', {session:false}),
    (req,res) => {
        Post.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like => like.user == req.user.id).length > 0)
                {
                    const removeIndex = post.likes
                                    .map(item => item.user)
                                    .indexOf(req.user.id);
                    
                    post.likes.splice(removeIndex,1);
                    post.save();

                    return res.json(post);
                }
                post.likes.unshift({user : req.user.id});
                post.save().then(post => res.json(post));
            })
})

// @route - Private : api/post/comment/:id
// Add Comment to a post
router.post(
    '/comment/:id',
    passport.authenticate('jwt', {session: false}),
    (req,res) => {
        Post.findById(req.params.id)
            .then(post => {
                
                const {errors, isValid} = validatePostInput(req.body);

                if(!isValid)
                {
                    return res.status(400).json(errors);
                }

                const NewComment = {
                    text : req.body.text,
                    user : req.user.id,
                    name : req.body.name,
                    avatar : req.body.avatar
                };

                post.comments.unshift(NewComment);
                post.save().then(post => res.json(post));
            })
});

// @route - Private : api/post/comment/:id/:comment_id
// Delete a Comment using its ID
router.delete(
    '/comment/:id/:comment_id',
    passport.authenticate('jwt', {session: false}),
    (req,res) => {
        Post.findById(req.params.id)
            .then(post => {
                // See whether there is actually some comment or not
                if(post.comments.filter(comment => comment._id == req.params.comment_id).length > 0 ) 
                {
                    const removeIndex = post.comments.map(comment => comment._id).indexOf(req.params.comment_id);

                    post.comments.splice(removeIndex,1);
                    post.save().then(post => res.json(post));
                }
                else
                {
                    res.status(404).json({ comment : 'Comment Not Found'});
                }
            })
});

module.exports = router;