const User = require('./../model/userModel')
const CatchAsync = require('./../utils/CatchAsync')

exports.SignUser =  CatchAsync(async (req, res, next) => {
        const newUser = await User.create(req.body)

        res.status(200).json({
            status : 'Success !',
            data : {
                newUser
            }
        })
})

