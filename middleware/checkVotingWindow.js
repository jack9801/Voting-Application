const Party = require('../model/party');

const checkVotingWindow = async (req, res, next) => {
  try {
    const { candidateID } = req.params;
    const candidate = await require('../model/candidate').findById(candidateID);
    if (!candidate) return res.status(400).json({ message: 'Invalid Candidate' });

    const party = await Party.findOne({ name: candidate.party });
    if (!party) return res.status(400).json({ message: 'Party not found' });

    const now = new Date();
    if (now < new Date(party.startTime) || now > new Date(party.endTime)) {
      return res.status(403).json({ message: 'Voting is not allowed at this time' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking voting window' });
  }
};

module.exports = checkVotingWindow;