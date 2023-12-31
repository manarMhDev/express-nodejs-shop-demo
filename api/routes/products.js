const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middlewear/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
destination : function(req,file,cb){
cb(null,'./uploads/')
},
filename : function(req,file,cb){
const dateStr = new Date().toISOString().replace(/:/g, '-');
cb(null, dateStr + file.originalname)
}
});
const fileFiler  =  (req , file , cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
// accept file 
cb(null,true);
    }
    else{
// reject file
cb(null,false);
    }
};
const upload = multer(
    {  storage : storage ,
       limits : {
            fileSize : 1024 * 1024  * 5 // in bytes == 5 M 
        },
        fileFilter :  fileFiler
});
router.get('/', ProductsController.products_get_all);
router.post('/', checkAuth, upload.single('productImage'),ProductsController.products_add_one);


router.get('/:productId', ProductsController.product_get_one);
router.patch('/:productId', checkAuth , ProductsController.products_update_one);
router.delete('/:productId', checkAuth ,ProductsController.products_delete_one);

module.exports  = router;