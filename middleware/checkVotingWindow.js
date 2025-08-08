const Party = require('../model/party');
const Candidate = require('../model/candidate');

const checkVotingWindow = async (req, res, next) => {
  try {
    const { candidateID } = req.params;
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const party = await Party.findOne({ name: candidate.party });
    if (!party || !party.startTime || !party.endTime) {
      return res.status(400).json({ message: 'This party does not have a valid election schedule.' });
    }

    const now = new Date();
    if (now < new Date(party.startTime) || now > new Date(party.endTime)) {
      return res.status(403).json({ message: 'Voting is not open at this time for this party.' });
    }
    
    // If the time is valid, proceed to the next middleware (the voting logic)
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking voting window' });
  }
};

module.exports = checkVotingWindow;