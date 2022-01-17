const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const User = require('../../models/User'); 
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validatLoginInput = require('../../validation/login');

// @route GET api/users/test
// @desc Tests users route
// @access public
router.get('/test',(req,res) => res.json({ msg: 'Users works'}));

// @route GET api/users/register
// @desc Register user
// @access public
router.post('/register',(req,res) => {

    const {errors , isValid} = validateRegisterInput(req.body);

    if(!isValid)
    {
       return res.status(400).json(errors);
    }

    User.findOne({email : req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({email : 'Email already exists'});
            }
            else{
                const avatar = gravatar.url(req.body.email, {
                    s : '200', //Size
                    r : 'pg', //Rating
                    default : 'mm' //Default
                });
                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    avatar : avatar,
                    password : req.body.password
                });
                
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch( err => console.log(err));
                    })
                })
            }
        })
})

// @route GET api/users/login
// @desc Login User / Returning JWT Token
// @access public
router.post('/login', (req,res) => {

    const {errors,isValid} = validatLoginInput(req.body);

    const email = req.body.email;
    const plainTextPassword = req.body.password;

    if(!isValid)
    {
        return res.status(400).json(errors);
    }

    User.findOne({email})
        .then(user => {
            if(!user)
            {
                errors.email = 'User Not Found';
                return res.status(404).json(errors);
            }

            const hashPassword = user.password;

            bcrypt.compare(plainTextPassword,hashPassword)
                .then(correctPassword => {
                    if(correctPassword)
                    {
                        // JWT PayLoad
                        const payload = {
                            id : user.id,
                            name : user.name,
                            avatar : user.avatar
                        };
                        jwt.sign(payload,
                                 keys.secretOrPrivateKey,
                                 {expiresIn : 3600},
                                 (err, token) => {
                                     res.json({
                                         sucess : true,
                                         token : 'Bearer ' + token
                                     });
                                 });
                    }
                    else
                    {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                })
        })
});

// @route GET api/users/current
// @desc Register user
// @access private
router.get('/current',passport.authenticate('jwt', {session : false}), (req,res) =>{
    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email
    });
});

module.exports = router;