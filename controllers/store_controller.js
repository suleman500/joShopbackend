const Store = require('../model/store.model');
//const Product = require('../model/product.model');
const User = require('../model/user_model');
const mongoose = require('mongoose');





/*const testCreateStore = async (req, res) => { 


try {
        // ✅ تجربة مؤقتة: تجاهل التحقق من المستخدم
        const newStore = new Store({
            name: req.body.name,
            description: req.body.description,
            vendorId: "6a3760eee97b0b69b85b652f", // معرف مستخدم موجود
        });
    
        const savedStore = await newStore.save();
        res.status(201).json({ message: 'Store created', store: savedStore });
    }
    catch (error) {
        res.status(500).json({ message: error.message }); // ✅ أظهر الخطأ
    }




}*/



const createdStore = async (req, res) => {

    try {

      const userId = req.user.id; // الحصول على معرف المستخدم من الطلب
        const { name, description, logoUrl, coverUrl } = req.body;
        //بتاكد انو المستخدم موجود
        const user = await User.findById(userId);
      
        const newStore = new Store({

name,
            description,
            logoUrl,
            coverUrl,
            vendorId:userId,

        })
        const savedStore = await newStore.save();
        user.role = 'vendor';
        user.storeId = savedStore._id;
        await user.save();
        res.status(201).json({ message: 'Store created successfully', store: savedStore });


    }
    catch (error) {


        res.status(500).json({ message: "Server Error", error: error.message });
     }



}
 
/*const updateStore = async (req, res) => { 

    try { }
catch (error) { }




}*/




const updateStore = async (req, res) => {
    try {
        

        const user = await User.findById(req.user.id);


        if (!user) {
           
            return res.status(404).json({
                success: false,
                message: "user not found"

            });

       }

        const storeId = req.user.storeId;

        if (!storeId) {
            return res.status(400).json({
                success: false,
                message:"is not stor id "
            });
        }

        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "is "
            });
        }

       
        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            {
                name: req.body.name || store.name,
                description: req.body.description || store.description,
                logoUrl: req.body.logoUrl || store.logoUrl,
                coverUrl: req.body.coverUrl || store.coverUrl,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "store updated successfully",
            store: updatedStore
        });
    } catch (error) {
        console.error(' Error updating store:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




const getAllStores = async (req, res) => {
    try {
        let filter = {};
        if (req.query.status) {
            filter = { status: req.query.status.split(',') };
        }
        const listStores = await Store.find(filter).populate('vendorId', 'name email');
        if (!listStores || listStores.length === 0) {
            return res.status(404).json({ message: 'No stores found' }); // ✅ أضف return
        }
        res.status(200).json({ listStores, message: 'Stores found successfully' }); // ✅ استخدم status(200)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};





/*getAllStores = async (req, res) => { 

    try { 
        let filter = {};
        if (req.query.status) {
filter={status:req.query.status.split(',')};

        }
        const listStores = await Store.find(filter).populate('vendorId', 'name email');
        if (!listStores) {
            res.status(404).json({ message: 'No stores found' });
        }
        res.send({ listStores, message: 'Stores found successfully' });
        

}
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',

        });

 }


}*/
module.exports = { createdStore, getAllStores, updateStore };