const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router=express.Router();
const User=require('./../model/user')
const Candidate=require('./../model/candidate')
const Party=require('./../model/party');
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
 // party logo upload 
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/logo', jwtAuthMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const userId = req.user.userData.id;
    if (!(await checkAdminRole(userId))) {
      return res.status(403).json({ message: 'Only admin can create party' });
    }
    const { name, colorTheme, startTime, endTime } = req.body;
    const logoBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const logo = `data:${mimeType};base64,${logoBase64}`; // for direct display
    const party = new Party({ name, colorTheme, startTime, endTime, logo });
    await party.save();
    res.status(201).json({ message: 'Party created', data: party });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create party' });
  }
});

// Get all parties with logo
router.get('/partylist', async (req, res) => {
  try {
    const parties = await Party.find({}, 'name logo'); // only fetch name and logo
    res.status(200).json({ parties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch party list' });
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
    const candidateID = req.params.candidateID; 
    const candidate= await Candidate.findById(candidateID);
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
    res.status(500).json({error: 'Internal Server Error'});
}
});

// vote count (party-wise aggregation)
router.get('/party', async (req, res) => {
  try {
    const candidates = await Candidate.find();

    const partyVoteMap = {};

    candidates.forEach(candidate => {
      const party = candidate.party;
      const votes = candidate.voteCount;

      if (partyVoteMap[party]) {
        partyVoteMap[party] += votes;
      } else {
        partyVoteMap[party] = votes;
      }
    });

    const voteRecord = Object.entries(partyVoteMap).map(([party, count]) => ({
      party,
      count
    }));

    return res.status(200).json(voteRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get list of candidates with name, party, and age only
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party age voteCount').sort({ voteCount: 'desc' });
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
// GET /candidate/currentuser
router.get('/currentUser', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.userData.id;
    const user = await User.findById(userId).select("-password"); // Don’t return password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE a candidate (Admin only)
router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.userData.id))) {
            return res.status(403).json({ message: 'User is not an Admin' });
        }
        const candidateId = req.params.id;
        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found to delete' });
        }

        const userIds = candidate.votes.map(vote => vote.user);

        if (userIds.length > 0) {
            await User.updateMany(
                { _id: { $in: userIds } },
                { $set: { isvoted: false } }
            );
        }

        const response = await Candidate.findByIdAndDelete(candidateId);
        if (!response) {
            return res.status(404).json({ message: 'Candidate could not be deleted' });
        }
        res.status(200).json({ message: 'Candidate deleted and voter statuses reset successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports=router;