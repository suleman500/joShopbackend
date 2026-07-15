const Order = require('../model/order.model');
const OrderItem = require('../model/orderItem');

// حذف طلب
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // نتأكد إن الطلب موجود
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "الطلب غير موجود"
            });
        }

        // نتحقق إن المستخدم هو صاحب الطلب أو أدمن
        if (order.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية لحذف هذا الطلب"
            });
        }

        // نحذف الطلب
        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            success: true,
            message: "تم حذف الطلب بنجاح"
        });
    } catch (error) {
        console.error('Error deleting order:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// إنشاء طلب جديد
const createOrder = async (req, res) => {
    try {
        // ننشئ عناصر الطلب  وناخذ معرفاتهم
        const orderItemsIds = await Promise.all(
            req.body.items.map(async (item) => {
                const newOrderItem = new OrderItem({
                    product: item.productId,
                    quantity: item.quantity,
                });
                const savedOrderItem = await newOrderItem.save();
                return savedOrderItem._id;
            })
        );

        // ننشئ الطلب الرئيسي
        const newOrder = new Order({
            user: req.user.id,
            address: req.body.address,
            phone: req.body.phone,
            totalPrice: req.body.totalPrice,
            items: orderItemsIds,
            status: req.body.status || 'pending',
        });

        const savedOrder = await newOrder.save();

        // نجيب الطلب مع تفاصيل المنتجات
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate({
                path: 'items',
                populate: { path: 'product', select: 'name price image' },
            });

        res.status(201).json({
            success: true,
            order: populatedOrder,
        });
    } catch (err) {
        console.error('Error creating order:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// جلب كل طلبات المستخدم الحالي
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate({
                path: 'items',
                populate: { path: 'product', select: 'name price image' },
            })
            .sort({ _id: -1 }); // نجبه  الاحدث 

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// جلب طلب واحد بالتفاصيل
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({
                path: 'items',
                populate: { path: 'product', select: 'name price image' },
            })
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'الطلب غير موجود',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (err) {
        console.error('Error fetching order:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { createOrder, getMyOrders, getOrderById, deleteOrder };