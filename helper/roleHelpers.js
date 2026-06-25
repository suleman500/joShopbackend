


function isAdmin(req, res, next) { 
    if (req.user.role != 'admin') {
        return res.status(403).json({message: "Access denied. Admin only."})
    
}
next();
    
}

function isVendor(req, res, next) { 
    if (req.user.role != 'vendor') {
        return res.status(403).json({message: "Access denied. Vendor only."})
    
}
next();
    
}


function isCustomer(req, res, next) {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ message: "Access denied. Customer only." });
    }
    next();
}


// هون الشغلات المشتركه بين التاجرو و الالادمن

function isAdminOrVendor(req, res, next) {
    if (req.user.role === 'admin' || req.user.role === 'vendor') {
        return next();
    }
    return res.status(403).json({ message: "Access denied. Admin or Vendor only." });
}



module.exports = { isAdmin, isVendor, isCustomer, isAdminOrVendor };
//ولازم ابعث هاي التفصبه بتوكنن