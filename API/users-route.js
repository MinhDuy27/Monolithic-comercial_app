const usersservice = require("../service/users-service");
const userauth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new usersservice();
  app.post("/users/signup", async (req, res, next) => {
    try{
      const { email, password,name, phone } = req.body;
      const   mydata   = await service.signup({ email, password, name, phone });
     return  res.json(mydata)
    }
    catch(error){
      next(error)
    }
  });
  
  app.put("/users/changepassword",userauth, async (req, res, next) => {
    try {
      const { email,oldpassword,newpassword} = req.body;
      const   mydata   = await service.changepassword({ email,oldpassword,newpassword }); 
      return res.json(mydata)
    } catch (error) {
      next(error)
    }
      
  });

  app.post("/users/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const  data  = await service.login({ email, password });
      return res.json(data)
    } catch (error) {
      next(error)
    }
      
  });

  //receive notification from Admin
  app.post("/users/notification", async (req, res, next) => {
    try {
      const { email,infor } = req.body;
      const data  = await service.postnotify({ email,infor });
      res.json(data);
    } catch (error) {
      next(error)
    }
  });
  // add address (>=0)
  app.post("/users/address", userauth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { country, province, city,street } = req.body;

      const { data } = await service.addnewaddress(_id, {
        country,
        province,
        city,
        street,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
  // get profile info
  app.get("/users/profile", userauth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const  data  = await service.getprofile( _id );
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
   // add product to cart
  app.put('/users/cart/add',userauth, async (req,res,next) => {
  const { _id } = req.user; 
  const {productid,quantity}  = req.body;
    try {   
        const data =  await service.addtocart(_id,productid, quantity, false)//false === add
        return res.json(data);
    } catch (err) {
        next(err)
    }
  });
  //delete product in cart
  app.delete('/users/cart/delete',userauth, async (req,res,next) => {
    const { _id } = req.user; 
    const {productid,quantity}  = req.body;
    try {   
        const data =  await service.addtocart(_id,productid, quantity, true)//true ===remove
        return res.json(data);
    } catch (err) {
        next(err)
    }
 });
  //get cart info
  app.get('/users/cart', userauth, async (req,res,next) => {
    const { _id } = req.user; // users _id
    try {
        const  data  = await service.getprofile(_id);
        return res.json(data.cart);
    } catch (err) {
        next(err);
    }
});
};