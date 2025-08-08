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

    const now = new Date(); // Current time in UTC on the server
    const startTime = new Date(party.startTime); // Start time from DB (already in UTC)
    const endTime = new Date(party.endTime);   // End time from DB (already in UTC)

    if (now < startTime || now > endTime) {
      // Create a more user-friendly error message
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      const friendlyStartTime = startTime.toLocaleDateString("en-US", options);
      const friendlyEndTime = endTime.toLocaleDateString("en-US", options);

      const message = now < startTime 
        ? `Voting has not yet started for this party. It will open on ${friendlyStartTime}.`
        : `Voting has closed for this party. It ended on ${friendlyEndTime}.`;

      return res.status(403).json({ message });
    }
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking voting window' });
  }
};

module.exports = checkVotingWindow;