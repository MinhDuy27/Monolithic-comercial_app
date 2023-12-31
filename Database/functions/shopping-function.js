const usersmodel = require("../models/users");
const ordermodel = require("../models/order");
const { v4: uuidv4 } = require('uuid'); //generate uniq id
const order = require("../models/order");
const { validationError } = require("../side-function/app-error");
// implement rabbit MQ
//Dealing with data base operations
class shoppingrepository {

    async getorder(userid) {
        return await order.find({ "usersid" : userid })
            .populate({path: 'items.product',
            select: '-quantity'})
    }
    async deleteorder(userid, orderid) {
        const profile = await usersmodel.findById(userid);
        let orderitem = profile.orders;
        let deleted = false;
        if (orderitem.length > 0) {
            orderitem.map((id) => {
                if (id.toString() === orderid.toString()) {
                    orderitem.splice(orderitem.indexOf(id), 1);
                    deleted = true
                }
            })
            if (!deleted) throw new validationError("orderid not valid")
        }
        else throw new validationError("user's order is empty");
        
        return await profile.save()
    }//
    async createneworder(usersid,deliveryaddress) {

        const profile = await usersmodel.findById(usersid).populate({path: 'cart.product',select: '-quantity'});
        let amount = 0;
        let cartItems = profile.cart
        if (cartItems.length > 0) {
            cartItems.map(item => {
                amount += parseInt(item.product.price) * parseInt(item.unit);
            });
            const orderid = uuidv4();
            let orderdate = new Date().toLocaleString();
            const order = new ordermodel({
                orderid,
                orderdate,
                status: 'processing',
                amount,
                deliveryaddress,
                items: cartItems
            })
            profile.cart = [];
            order.usersid = usersid;
            order.populate('items.product');
            const orderResult = await order.save();
            profile.orders.push(orderResult);
            await profile.save();
            return orderResult;
        }
        throw new validationError("cart is empty");
    }
}
module.exports = shoppingrepository;