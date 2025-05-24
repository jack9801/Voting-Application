const express = require('express')
const router=express.Router();
const User=require('./../model/user')
const Candidate=require('./../model/candidate')
const {jwtAuthMiddleware, generateToken}=require('./../jwt');
const checkAdminRole=async(userId)=>{
    try{
        const user=await User.findById(userId);
        if(user.role==='Admin')
            return true;

    }
    catch(err){
        return false;

    }
}
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try {
        const userdata=req.user.userData;
        const userId=userdata.id;
        if(!(await checkAdminRole(userId))) {
            res.status(403).json({message:'user is not Admin role'});
        }
        const  data=req.body;
        const candidate=new Candidate(data);
        const response=await candidate.save();
        res.status(200).json({
            message:'Candidate created successfully',
            data:response
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({err,message:'Error saving person'});
        
    }
});
// update existing candidate
router.put('/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const data=req.body;
        const candidate=await Candidate.findByIdAndUpdate(id,data,{new:true});
        if(!candidate){
            return res.status(404).json({message:'Candidate not found'});
        } 
        res.status(200).json({
            message:'Candidate updated successfully',
            data:candidate
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({err,message:'Error updating candidate'});
        
    }
}); 
// lets start votting
router.get('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
    const userData=req.user.userData;
    const userId=userData.id;
    const user= await User.findById(userId);
     candidateID = req.params.candidateID; 
    console.log(candidateID);
    const candidate= await Candidate.findById(candidateID);
    console.log(candidate);
    if(!candidate){
        return res.status(400).json({message:'Inavlid Candiadte'});
    }
    if(!user){
        return res.status(400).json({message:'Inavlid User'});
    }
    if(user.role == 'admin'){
        return res.status(403).json({ message: 'admin is not allowed'});
    }
    if(user.isvoted) {
        return res.status(400).json({message:'You have alread Voted'});
    }
        user.isvoted=true;
        candidate.voteCount++;
        candidate.votes.push({ user: userId });
        await user.save();
        await candidate.save();
        return res.status(200).json({ message: 'Vote recorded successfully' });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({err: 'Internal Server Error'});

    }
});

// vote count 
router.get('/vote',async(req,res)=>{
    try{
    const candidate = await Candidate.find().sort({voteCount: 'desc'});

    // Map the candidates to only return their name and voteCount
    const voteRecord = candidate.map((data)=>{
        return {
            party: data.party,
            count: data.voteCount
        }
    });

    return res.status(200).json(voteRecord);
}catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
}
});
// get list of candidates with name, party, and age only
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party age');
        res.status(200).json({
            message: 'Candidates fetched successfully',
            data: candidates
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching candidates',
            error
        });
    }
});


module.exports=router;
