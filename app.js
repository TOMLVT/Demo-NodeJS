const express = require('express');
const fs = require('fs');
const morgan = require('morgan') // ghi lại các log các http gửi đến server 

const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter')

const app = express();

if(process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line prettier/prettier
    app.use(morgan('dev'))
}

app.use(express.json()) // middleware 
app.use(express.static(`${__dirname}/public`)) // use serving file static : img , css, html, ...

app.use((req, res,next) => {
    console.log('This running MiddleWare !')
    next()
})

app.use((req , res , next) => {
     req.requestTime = new Date().toISOString()
     next()
});

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id' , getTour)
// app.post('/api/v1/tours' ,createTour )
// app.patch('/api/v1/tours/:id' , updateTour)
// app.delete('/api/v1/tours/:id' , deleteTour)

// ROUTE ----------------------------------------


app.use('/api/v1/tours' , tourRouter)
app.use('/api/v1/user' , userRouter)


module.exports = app
