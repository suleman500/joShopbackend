

function errorHandler(err, req, res, next) {

    if (err) {
    
       return  res.status(400).json({ message: err.message });
    }
    return res.status(500).json(err);

   
}

module.exports = errorHandler;