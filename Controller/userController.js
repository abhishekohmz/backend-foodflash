const jwt = require('jsonwebtoken')
const Users = require("../model/userSchema")



// signup
exports.signup = async (req, res) => {
    let check = await Users.findOne({
        email: req.body.email
    })

    if (check) {
        return res.status(400).json({
            success: false,
            errors: "existing user found with same email"
        })
    }
    let cart = {}
    for (let i = 100; i <= 3000; i++) {
        cart[i] = 0
    }
    const user = new Users({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        cartData: cart
    })

    await user.save()

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_key')
    res.json({
        success: true,
        token
    })
}


// login

exports.login = async (req, res) => {
    let user = await Users.findOne({
        email: req.body.email
    });

    if (user) {
        const passCompare = req.body.password === user.password;

        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(data, 'secret_key');
            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    mobile: user.mobile
                }
            });
        } else {
            res.json({
                success: false,
                errors: "wrong password"
            });
        }
    } else {
        res.json({
            success: false,
            errors: "invalid email id"
        });
    }
};


// getuser
exports.getuser = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, errors: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                postal_code: user.postal_code,
                landmark: user.landmark
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, errors: 'Server error' });
    }
}


// add product in cartdata
exports.addTocart = async (req, res) => {

    console.log("added", req.body.itemId);

    let userData = await Users.findOne({ _id: req.user.id })

    userData.cartData[req.body.itemId] += 1

    await Users.findOneAndUpdate(
        { _id: req.user.id },
        { cartData: userData.cartData }
    )

    res.send("Addedd")
}

// remove product from cartdata
exports.removeCart = async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id })
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: userData.cartData }
        )
        res.send()
    }
}

// clear cart
exports.clearCart = async (req, res) => {
    try {
        console.log("Clearing cart for user", req.user.id);
        let userData = await Users.findOne({ _id: req.user.id });

        for (let itemId in userData.cartData) {
            userData.cartData[itemId] = 0;
        }

        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: userData.cartData }
        );

        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: "Server error" });
    }
}

// get cart
exports.getCart = async (req, res) => {
    console.log('getcart');
    let userData = await Users.findOne({ _id: req.user.id })
    res.json(userData.cartData)
}

// update user
exports.updateuser = async (req, res) => {
    const userId = req.user.id;
    console.log(`Updating user with ID: ${userId}`);
    const updateData = req.body;
    console.log('Update data:', updateData);

    try {
        const updatedUser = await Users.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: true,
            updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
}

// create ordr
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { total_amount, payment_method } = req.body;

        const orderItems = [];
        for (const [productId, quantity] of Object.entries(user.cartData)) {
            if (quantity > 0) {
                orderItems.push({
                    product: productId,
                    quantity: quantity
                });
            }
        }

        const newOrder = {
            order_items: orderItems,
            total_amount: total_amount,
            payment_method: payment_method,
        };

        user.orders.push(newOrder);
        user.cartData = Object.keys(user.cartData).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {});
        await user.save();

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// get all users orders
exports.getallUsersOrders = async (req, res) => {
    try {
        const users = await Users.find({}).select('first_name last_name email telephone address postal_code landmark orders mobile');

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        const userOrders = users.map(user => ({
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                telephone: user.telephone,
                address: user.address,
                postal_code: user.postal_code,
                landmark: user.landmark,
                mobile: user.mobile
            },
            orders: user.orders
        }));

        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.getUserOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ orders: user.orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
