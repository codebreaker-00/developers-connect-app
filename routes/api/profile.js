const express = require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const passport = require('passport');
mongoose.set('useFindAndModify', false);

// Load Profile Model
const Profile = require('../../models/Profile');

// Load User Model
const User = require('../../models/User');

// Load Validation for Profile
const validateProfileInput = require('../../validation/profile');

// Load Experience for Profile
const validateExperienceInput = require('../../validation/experience');

// Load Education for Profile
const validateEducationInput = require('../../validation/education');

// @route   Public : api/profile/test
// @desc    Tests Profile route  
router.get('/test',(req,res) => res.json({ msg: 'Profile works'}));

// @route Private : api/profile
// @desc Get cuurent user profile {GET method here}
router.get('/', passport.authenticate('jwt', {session:false}),
    (req,res) => {
        const errors = {};

        Profile.findOne({user : req.user.id})
            .populate('user', ['name','avatar'])
            .then( profile => {
                if(!profile) {
                    errors.noprofile = 'There is no profile for this user';
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch( err=> res.status(404).json(err));
    }
);

// @route - Private : api/profile/   
// Create or Update Profile for user {POST Method here}
router.post('/', passport.authenticate('jwt', {session:false}),
    (req, res) => {

        const {errors,isValid} = validateProfileInput(req.body);

        if(!isValid)
        {
            return res.status(400).json(errors);
        }

        const profileFields = {};
        profileFields.user = req.user.id;

        if(req.body.handle) profileFields.handle = req.body.handle;
        if(req.body.company) profileFields.company = req.body.company;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.location) profileFields.location = req.body.location;
        if(req.body.status) profileFields.status = req.body.status;
        if(req.body.bio) profileFields.bio = req.body.bio;
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

        //Skills is an array of string so we will consider it explicitly 
        if( typeof req.body.skills !== 'undefined' )
        {
            profileFields.skills = req.body.skills.split(',');
        }

        profileFields.social = {};        
        if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    

        Profile.findOne({ user : req.user.id })
            .then( profile => {
                if(profile)
                {
                    // Check if the handle (if updated, is available)
                    Profile.findOne({handle : req.body.handle})
                        .then( userWithSameHandle => {
                            if(userWithSameHandle.user != req.user.id)
                            {
                                errors.handle = 'handle unavailable';
                                res.status(400).json(errors);
                            }
                            else
                            {
                                Profile.findOneAndUpdate(
                                    { user : req.user.id },
                                    { $set : profileFields },
                                    { new : true}
                                    )
                                .then( profile => res.json(profile) );
                            }
                        })
                }
                else
                {
                    // Checking if handle is already take
                    Profile.findOne({handle : req.body.handle })
                        .then( profile => {
                            if(profile)
                            {
                                errors.handle = 'handle unavailable';
                                res.status(400).json(errors);
                            }
                            else
                            {
                                new Profile(profileFields).save()
                                    .then(profile => {
                                        res.json(profile);
                                    })
                            }
                        } )
                }  
            })
    
    }
)

// @route - Public : api/profile/handle/:handle
// Get profile of any person with given handle
router.get('/handle/:handle', (req,res) => {
    
    const errors = {};

    Profile.findOne({handle : req.params.handle})
        .populate('user', ['name','avatar'])
        .then( profile => {
            if(!profile)
            {
                errors.noprofile = 'No Profile Found';
                res.status(404).json(errors);
            }
            else
            {
                res.json(profile);
            }
        })
        .catch( err => console.log(err));
})

// @route - Public : api/profile/handle/:handle
// Get profile of any person with given user ID
router.get('/user/:user_id', (req,res) => {
    const errors = {};

    Profile.findOne({user : req.params.user_id})
        .populate('user', ['name','avatar'])
        .then( profile => {
            if(!profile)
            {
                errors.noprofile = 'No Profile Found';
                res.status(404).json(errors);
            }
            else
            {
                res.json(profile);
            }
        })
        .catch( err => res.status(404).json({noprofile : 'There is no profile for this user'}));
})


// @route - Public : api/profile/all
// Get list of All the Profiles
router.get('/all', (req,res)=> {
    const errors = {};

    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if(!profiles)
        {
            errors.profile = 'There are No Profiles';
            res.status(404).json(errors);
        }
        else
        {
            res.json(profiles);
        }
    })
    .catch( err => res.status(404).json({profile : 'There are No Profiles'}))
})


// @route - Private : api/profile/experience
// Add experience to the Profile of the User
router.post('/experience', passport.authenticate('jwt', {session:false}),
    (req,res) => {
        const {errors, isValid} = validateExperienceInput(req.body);

        if(!isValid)
        {
            return res.status(400).json(errors);
        }

        Profile.findOne({user : req.user.id})
            .then( profile => {
                if(profile)
                {
                    const newExperience = {
                        title : req.body.title,
                        company : req.body.company,
                        location : req.body.location,
                        from : req.body.from,
                        to : req.body.to,
                        current : req.body.current,
                        description : req.body.description
                    };

                    profile.expiriences.unshift(newExperience);
                    profile.save()
                        .then(profile => res.json(profile));
                }
                else
                {
                    errors.profile = 'No Profile Found';
                    res.status(404).json(errors);
                }
            } )
    }
)

// @route - Private : api/profile/education
// Add education details to your profile
router.post('/education', passport.authenticate('jwt', {session:false}),
    (req,res) => {
        const {errors,isValid} = validateEducationInput(req.body);
        if(!isValid)
        {
            return res.status(400).json(errors);
        }
        Profile.findOne({user : req.user.id})
        .then( profile => {
            if(!profile)
            {
                errors.profile = 'Profile Not Found';
                res.status(404).json(errors);
            }
            else
            {
                const newEducationInput = {
                    school : req.body.school,
                    degree : req.body.degree,
                    feildofstudy : req.body.feildofstudy,
                    from : req.body.from,
                    to : req.body.to,
                    current : req.body.current
                  };

                profile.education.unshift(newEducationInput);
                profile.save().then( profile => res.json(profile));
            }
        })
})

// @route - Private : api/profile/education/:edu_id
// Delete an Education Array object by using its ${id}
router.delete(
    '/education/:edu_id',
    passport.authenticate('jwt', {session: false}),
    (req,res) => {
        const errors = {};
        Profile.findOne({user : req.user.id})
        .then( profile => {
            const remIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
            profile.education.splice(remIndex,1);
            profile.save()
                .then(profile => res.json(profile));
        })
        .catch( err => res.status(404).json(err));
})

// @route - Private : api/profile/experience/exp_id
// Delete an Object from an Array of experiences
router.delete(
    '/experience/:exp_id',
    passport.authenticate('jwt', {session:false}),
    (req,res) => {
        Profile.findOne({user:req.user.id})
            .then(profile => {
                const removeIndex = profile.expiriences
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);
                
                profile.expiriences.splice(removeIndex, 1);
                profile.save()
                    .then(profile => res.json(profile));
            })
            .catch( err => res.status(404).json(err));
});

// @rote - Private : api/profile
// Delete the Profile and the User
router.delete(
    '/',
    passport.authenticate('jwt', {session:false}),
    (req,res) => {
        Profile.findOneAndDelete({user : req.user.id})
            .then( () => {
                User.findOneAndDelete({ _id : req.user.id })
                    .then(() => res.json({sucess : true}));
            })
})

module.exports = router;