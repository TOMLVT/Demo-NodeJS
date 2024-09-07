const express = require('express')
const userController = require('../Controller/userController')
const authController = require('../Controller/authController')

const router = express.Router()

router.post('/signup' , authController.SignUser)

router.route('/').get(userController.getAlluser).post(userController.createUSer) 

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser)

module.exports = router