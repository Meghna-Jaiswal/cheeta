const bcrypt = require('bcrypt');

const { Response, BadRequestResponse } = require("../../lib/response");
const userObjCreator = require('../../objects/cheetaUsers');
const CheetaUsers = require('../../models/cheeta-users');
const getJwt = require('../../lib/getJwt');
const getEmailString = require('../../lib/getEmailString');
const sendMail = require('../../lib/sendEmail');

module.exports = {
  register: async (req, res, next) => {
      
      try {
        console.log('Create User \n body::', req.body);

        // check if every fields are there
        // create object for users data
        let userObj = await userObjCreator(req);

        // if not sufficient info send response fields missing
        if(!userObj.created) 
            return res.status(400).json({
                status: {
                    code: 400,
                    message: "Insufficient info!"
                }
            })


        // check if email exists
        let result = await CheetaUsers.find({
            email: req.body.email,
            status: "active"
        })

        if((result && result.length))
            return res.status(400).json({
                    status: {
                        code: 400,
                        message: "User with this email already exists!"
                    }
                })


        console.log(userObj);
                
        // save in db
        const resp = await CheetaUsers.create(userObj.obj);

        // get email string
        let emailStr = await getEmailString(userObj.obj.email, userObj.obj.others.otp)
        console.log(emailStr);

        // send OTP email
        await sendMail(
                userObj.obj.email,
                'OTP Verification',
                emailStr
            )

        return res.json({
            status: {
                code: 200,
                message: "Successfully Registered!"
            },
            data: {
                email: userObj.obj.email,
                userId: resp._id
            }
        })

    } catch(error) {
        console.log(error);

        return res.status(400).json({
            status: {
                code: 400,
                message: "Something went wrong!",
                error
            }
        })
    }
  },




  verifyOTP: async (req, res, next) => {

    try {
        console.log('Verify User \n body::', req.body);

        if(!(req.body.email && req.body.otp && req.body.userId))
            return res.status(400).json({
                        status: {
                            code: 400,
                            message: "Insufficient info!"
                        }
                    })
        
        const user = await CheetaUsers.findOne({ email: req.body.email, _id: req.body.userId, status: "deactivated" });
        console.log("user found:::", user);
        
        if (!(user && user._id))
            return res.status(400).json({
                status: {
                    message: "Invalid Credentials!",
                    code: 400,
                }
            }); 

        // Verify OTP here
        if(!(user.others.otp == req.body.otp))
            return res.status(400).json({
                    status: {
                        message: "Invalid Credentials!",
                        code: 400,
                    }
                }); 

        let result = await CheetaUsers.findByIdAndUpdate(user._id, {$set: {status: 'active', others:{otp: ''}}}, {new: true, useFindAndModify: false});

        console.log(result);

        return res.json({
            status: {
                message: "User Verified Successfully!",
                code: 200,
            }
        }); 

    } catch(error) {
        console.log(error);

        return res.status(400).json({
            status: {
                code: 400,
                message: "Something went wrong!",
                error
            }
        })
    }


  },




  login: async (req, res, next) => {
      
    console.log("Login \n body ::", req.body.email, req.body.password)

    try {

        if (!(req.body.email && req.body.password))
            return res.status(400).json({
                    status: {
                        code: 400,
                        message: "Invalid Credentials!",
                    }
                });


        const user = await CheetaUsers.findOne({ email: req.body.email, status: "active" });
        console.log("user found:::", user);

        if (!(user && user._id))
            return res.status(400).json({
                status: {
                    message: "Invalid Credentials!",
                    code: 400,
                }
            });  

        const compareStatus = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!compareStatus)
            return res.status(400).json({
                    status: {
                        message: "Invalid Credentials!",
                        code: 400,
                    }
                });
        
        // create token and send res with user data and token
        let tokenRes = await getJwt(
            user.email,
            user.password,
            user._id,
            user.mobile,
            
          );

        return res.json({
            status: {
                message: "Successful Login!",
                code: 200,
            },
            data: tokenRes.data
        });

    } catch(error) {
        console.log(error);

        return res.status(400).json({
            status: {
                code: 400,
                message: "Something went wrong!",
                error
            }
        })
    }
  },


  forgetPassword: async (req, res, next) => {
    try {
        console.log('Forget Password \n body::', req.body);

        if(!(req.body.email))
            return res.status(400).json({
                        status: {
                            code: 400,
                            message: "Insufficient info!"
                        }
                    })
        
        const user = await CheetaUsers.findOne({ email: req.body.email });
        console.log("user found:::", user);
        
        if (!(user && user._id))
            return res.status(400).json({
                status: {
                    message: "Invalid Credentials!",
                    code: 400,
                }
            }); 

        // Create new OTP here 

        let newOTP = {
            others: {
                otp: Math.floor(1000 + Math.random() * 9000)
            }
        }

        let result = await CheetaUsers.findByIdAndUpdate(user._id, {$set: newOTP}, {new: true, useFindAndModify: false});
        
        // send OTP email
        let emailStr = await getEmailString(result.email, result.others.otp)
        console.log(emailStr);

        await sendMail(
                result.email,
                'OTP Verification',
                emailStr
            )

        console.log(result);

        return res.json({
            status: {
                message: "Successfull!",
                code: 200,
            }
        }); 

    } catch(error) {
        console.log(error);

        return res.status(400).json({
            status: {
                code: 400,
                message: "Something went wrong!",
                error
            }
        })
    }

  },

  newPassword: async (req, res, next) => {
    try {
        console.log('Verify User \n body::', req.body);

        if(!(req.body.email && req.body.otp && req.body.newPassword))
            return res.status(400).json({
                        status: {
                            code: 400,
                            message: "Insufficient info!"
                        }
                    })
        
        const user = await CheetaUsers.findOne({ email: req.body.email });
        console.log("user found:::", user);
        
        if (!(user && user._id))
            return res.status(400).json({
                status: {
                    message: "Invalid Credentials!",
                    code: 400,
                }
            }); 

        // Verify OTP here
        if(!(user.others.otp == req.body.otp))
            return res.status(400).json({
                    status: {
                        message: "Invalid Credentials!",
                        code: 400,
                    }
                }); 

        // Set New Password
        const hash = await bcrypt.hash(req.body.newPassword, 10);
        let result = await CheetaUsers.findByIdAndUpdate(user._id, {$set: {status: 'active', password: hash, others:{otp: ''}}}, {new: true, useFindAndModify: false});

        console.log(result);

        return res.json({
            status: {
                message: "Password Changed Successfully!",
                code: 200,
            }
        }); 

    } catch(error) {
        console.log(error);

        return res.status(400).json({
            status: {
                code: 400,
                message: "Something went wrong!",
                error
            }
        })
    }

  }
};