const express = require('express');
const fs = require('fs');
const morgan = require('morgan') // ghi lại các log các http gửi đến server 

const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter')
const AppError = require('././utils/appError')


const app = express();

if(process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line prettier/prettier
    app.use(morgan('dev'))
}

app.use(express.json()) // middleware 
app.use(express.static(`${__dirname}/public`)) // use serving file static : img , css, html, ...



app.use((req , res , next) => {
     req.requestTime = new Date().toISOString()
     next()
});



app.use('/api/v1/tours' , tourRouter)
app.use('/api/v1/user' , userRouter)

// check the url -----------------------------------------------
app.all('*', (req, res , next) => {
    // res.status(404).json({
    //     status: 'Fail !',
    //     message: `Can't find ${req.originalUrl} on this server !`
    // })
    next(new AppError(`Can't find ${req.originalUrl} on this server !` , 404))
})

module.exports = app
