// const fs = require('fs')
const Tour = require('./../model/tourModel')
const APIFeatures = require('./../utils/apiFeatures')


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
exports.getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({
            status: 'Fail!',
            message: err.message || 'Error sending data!',
        });
    }
};


exports.getTour =  async(req ,res) => {

    try {
      const tour =   await Tour.findById(req.params.id)
       res.status(200).json({
        status: 'success !',
        data : {
            tour
        }
     })
    } catch (err) {
        res.status(401).json({
            status : 'Fail !',
            message : 'Error send Data !'
        })
    }

}



exports.createTour = async (req , res) => {
        try {
           // const newTours = new Tour({})
            // newTours.save()

            const newTour = await Tour.create(req.body)

            res.status(201).json({
                status : 'success',
                data : {
                    tour : newTour
                }
            })
  
        } catch (err) {
            res.status(400).json({
                status : 'Fail !',
                message : err
            })
        }
 }

 // use from mongoose model : findByIdandUpdate , findId,...

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        })
        res.status(200).json({
            status: 'success !',
            data : {
              tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status : 'Fail !',
            message : err
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
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
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });

    } catch (err) {
        res.status(500).json({
            status: 'Fail',
            message: err.message
        });
    }
};



exports.deleteTour = async (req , res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status : 'success !',
            data : null
        })
    }catch (err) {
        res.status(400).json({
            status : 'Fail !',
            message : 'Invalid data send !'
        })
    }
}