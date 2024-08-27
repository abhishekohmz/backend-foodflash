const express = require('express')
const router=new express.Router()

const productsController=require('../Controller/productsController')
const userController=require('../Controller/userController')
const fetchUser = require('../middileware/jwtMiddileware')

// user signup
router.post('/signup',userController.signup)

// user login
router.post('/login',userController.login)

// get user
router.get('/getuser',fetchUser,userController.getuser)

// add category
router.post('/category',productsController.addCategory)

// get all category
router.get('/allcategory',productsController.getCategory)

// remove category
router.delete('/removecategory',productsController.removeCategory)

// add product
router.put('/category/:categoryId/product',productsController.addProduct)

// get product
router.get('/category/:categoryId',productsController.getProduct)

// remove product
router.delete('/removeproduct',productsController.removeProduct)

// add daily deals
router.post('/add-to-daily-deal',productsController.addDailydeal)

// get daily deals
router.get('/daily-deals',productsController.getDailydeal)

// remove daily deal
router.post('/remove-dailydeal',productsController.removeDailydeal)

// add flash sale
router.post('/flash-sale',productsController.addFlashsale)

// get flash sale
router.get('/getflashsale',productsController.getFlashsale)

// remove flash sale
router.post('/remove-flashsale',productsController.removeFlashsale)

// add to cart 
router.post('/addtocart',fetchUser,userController.addTocart)

// remove cart
router.delete('/removefromcart',fetchUser,userController.removeCart)

// remove all cart
router.delete('/clearcart',fetchUser,userController.clearCart)

// getcart
router.post('/getcart',fetchUser,userController.getCart)

// update user
router.put('/updateuser',fetchUser,userController.updateuser)

// create order
router.post('/createorder',fetchUser,userController.createOrder)

// get all users orders
router.get('/users/orders',userController.getallUsersOrders)

// get single user order
router.get('/userorder',fetchUser,userController.getUserOrder)


module.exports=router