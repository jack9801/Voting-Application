const express = require('express')
const router=express.Router();
const User=require('./../model/user')
const Candidate=require('./../model/candidate')
const {jwtAuthMiddleware, generateToken}=require('./../jwt');
router.post('/signup', async(req,res)=>{
    try {
        const  data=req.body;
        const adminuser=await User.findOne({role:'Admin'});
        if(data.role==='Admin' && adminuser){ // implement single admin
            return res.status(400).json({message:'Admin already exists'});
        }

        // make sure aadhar card contain 12 digit
        if (!/^\d{12}$/.test(data.aadharcardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }
        // check if user already exist
        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharcardNumber: data.aadharcardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }
        // save newuser to database
        const newuser=new User(data);
        const response=await newuser.save();
        res.status(200).json({
            message:'User created successfully',
            data:response
        });

        const payload={
            id:response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        res.status(200).json({response: response, token: token});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({error,message:'Error saving person'});
        
    }
});
// login user
router.post('/login',async(req,res)=>{
    try {
        const {aadharcardNumber,password}=req.body;
        // check if adharcard or password is missing
        if(!aadharcardNumber || !password){
            return res.status(400).json({message:'Please provide aadharcardNumber and password'});
        }
        const user=await User.findOne({aadharcardNumber:aadharcardNumber});
        if(!user || !( await user.comparePassword(password))){
            return res.status(404).json({message:'User or password invalid'});
        }
        const payload={
            id:user.id
        }
        const token = generateToken(payload);
        res.status(200).json({message:'User logged in successfully',token:token});
       
    } catch (error) {
        console.log(error);
        res.status(500).json({error,message:'Error logging in user'});
        
    } });
    // get profile of user
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try {
        const userData = req.user.userData; // extract data from payload
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({error,message:'Internal Server Error'});
        
    }});
    router.post('/profile/password',jwtAuthMiddleware,async(req,res)=>{
        try{
            const userData = req.user.userData; // extract data from payload
            const userId = userData.id;
            console.log(userId);
            const {currentPassword,NewPassword}=req.body;
            if(!currentPassword || !NewPassword){
                res.status(400).json({error:'Both current and new password required'})
            }
            const user= await User.findById(userId);
            if(!user || !(await user.comparePassword(currentPassword))){
                res.status(400).json({error:'Invalid Current Password'});
            }
            user.password=NewPassword;
            await user.save();
            console.log('password updated');
            res.status(200).json({ message: 'Password updated' });

        }
        catch(err){
            console.log(error);
            res.status(500).json({error,message:'Internal Server Error'});
            
        }
    });



module.exports=router;
