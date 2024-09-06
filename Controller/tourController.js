// const fs = require('fs')
const Tour = require('./../model/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const CatchAsync = require('./../utils/CatchAsync')
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {  // Đổi thứ tự tham số
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};




exports.checkBody = (req , res , next) => {
     if (!req.body.name || !req.body.price) {
           return  res.status(400).json({
                status : 'Failed is not name or price !',
                message : 'Name and Price is not empty !'
            })
     }
     next()
}
// Get Tours -----------------------------------------------

// --- use function instead using of try / catch 

exports.getAllTours = CatchAsync (async (req, res) => {
    
        console.log(req.query);

        // Execute the query
        const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitField().paginate()
        const tours = await features.query;

        // Send response 
        res.status(200).json({
            requestedAt: req.requestTime,
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        });
    
        res.status(500).json({
            status: 'Fail!',
            message: err.message || 'Error sending data!',
        });
    
});


exports.getTour =   CatchAsync(async(req ,res) => {

  
      const tour =   await Tour.findById(req.params.id)

       if(!tour) {
          return next(new AppError('Np tour found with that ID !' , 404)) // Refactoring AppError show error 
       }

       res.status(200).json({
        status: 'success !',
        data : {
            tour
        }
     })
   
       

})



exports.createTour = CatchAsync(async (req , res) => {
       
           // const newTours = new Tour({})
            // newTours.save()

            const newTour = await Tour.create(req.body)

            if(!tour) {
                return next(new AppError('Np tour found with that ID !' , 404)) // Refactoring AppError show error 
             }

            res.status(201).json({
                status : 'success',
                data : {
                    tour : newTour
                }
            })
  
      
          
        
 })

 // use from mongoose model : findByIdandUpdate , findId,...

exports.updateTour = CatchAsync(async (req, res) => {
   
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        })

        if(!tour) {
            return next(new AppError('Np tour found with that ID !' , 404)) // Refactoring AppError show error 
         }


        res.status(200).json({
            status: 'success !',
            data : {
              tour
            }
        })
  
      
    
})

// structure group complexed operator -------------------------------------------------------- 
exports.getTourStats = CatchAsync(async (req, res) => {
   
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort : { avgPrice : 1 }
            },
           
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });

   
        res.status(500).json({
            status: 'Fail',
            message: err.message
        });
    
});

// monthly tour ------------------------------------------------------------------
exports.getMonthlyPlan = CatchAsync(async (req, res) => {
   
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' }, // Nhóm theo tháng
                    numTourStart: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $sort: {
                    numTourStart: -1
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
   
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    
});



exports.deleteTour = CatchAsync(async (req , res) => {
    
        const tour = await Tour.findByIdAndDelete(req.params.id)

        if(!tour) {
            return next(new AppError('Np tour found with that ID !' , 404)) // Refactoring AppError show error 
         }

         
        res.status(204).json({
            status : 'success !',
            data : null
        })
 
      
})