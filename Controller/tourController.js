// const fs = require('fs')
const Tour = require('./../model/tourModel')

// exports.checkID = (req,res,next,val) => {
//     console.log(`Tour id is ${val}`)
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'Faild !',
//             message : 'Invalied ID !'
//         })
//     }
//     next()
// }

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

        // 1 -- Filtering 
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2 -- Advanced Filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // Sorting 
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); 
        }

        // Execute the query
        const tours = await query;

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