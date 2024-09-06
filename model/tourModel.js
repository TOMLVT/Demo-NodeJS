const mongoose = require('mongoose')
const slugify = require('slugify') // tạo URL dễ đọc ----------------------
const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true , 'A tour must have a name !'],
        unique : true,
        trim : true,
        maxlength: [40 , 'A tour must have less or equal 40 character !'], // data validation
        minlength:  [10 , 'A tour must have more or equal 10 character !'],
        // validate: [validator.isAlpha , 'Tour name must only contain characters !'] // input string validation library
    },
    slug: String,
    duration : {
        type : Number,
        required : [true , 'A tour must have a duration']
    },
    maxGroupSize : {
        type : Number,
        required : [true , 'A tour must have a group size']
    },
    difficulty : {
        type : String,
        required : [true , 'A must have a difficutly '],
        enum: {
            values: ['easy' , 'medium' , 'difficult'],
            message: 'Difficult is either : eassy , medium , difficult !'
        }
    },
    ratingsAverage : {
        type : Number,
        default : 4.5,
        min: [1, 'Rating must have above 1 !'],
        max: [5, 'Rating must have below 5 !']
    },
    ratingQuantity : {
        type : Number,
        default : 4.5
    },  
    price : {
        type : Number,
        required : [true , 'A tour must have a price !']
    },
    priceDiscount : {
        type: Number,
        validate : {
            validator: function(val) {
                return val < this.price;
            },
            message : 'Discount price ({VALUE}) should be below regular price !'
        }
    },
    summary : {
        type : String,
        trim : true,
        required : [true , 'A tour must have a summery']
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true , 'A tour must have a image']
    },
    images : [String],
    createAt : {
        type : Date,
        default : Date.now(),
        select : false
    },
    startDates : [Date],
    secretTour : {
        type : Boolean,
        default : false
    }
},{
    toJSON: { virtuals: true}, // xác định data sẽ đc chuyển thành JSON
    toObject: { virtuals: true} // Xác định cách dữ liệu của tài liệu sẽ được chuyển đổi thành một object JavaScript.
})

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7
})


// DOCUMENT MIDDLEWARE ---------------------------------------------------------
tourSchema.pre('save' , function(next) {
    this.slug = slugify(this.name , { low : true })
    next()
})

// tourSchema.post('save' , function(doc, next) {
//     console.log(doc)
//     next()
// })

// QUERY MIDDLEWARE---------------------------------------------------------
tourSchema.pre(/^find/ , function(next) {
    this.find({ secretTour: { $ne: true }})
    this.start = Date.now()
    next()
})
//AGGRERATION MIDDLEWARE -------------------------------------------------------
tourSchema.pre('aggregate' , function(next) {
    this.pipeline().unshift( { $match: { secretTour: { $ne: true } }})
    // console.log(this.pipeline())
    next()
})




const Tour = mongoose.model('Tour' , tourSchema)

module.exports = Tour