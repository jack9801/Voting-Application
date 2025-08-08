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

    const now = new Date(); // Current server time in UTC
    const startTime = new Date(party.startTime); // Start time from DB (already UTC)
    const endTime = new Date(party.endTime);   // End time from DB (already UTC)

    if (now < startTime || now > endTime) {
      // Create user-friendly date strings for the error message
      const options = { timeZone: 'Asia/Kolkata', hour12: true, year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      const friendlyStartTime = startTime.toLocaleString("en-IN", options);
      const friendlyEndTime = endTime.toLocaleString("en-IN", options);

      const message = now < startTime 
        ? `Voting has not yet started for this party. It will open on ${friendlyStartTime} (IST).`
        : `Voting has closed for this party. It ended on ${friendlyEndTime} (IST).`;

      return res.status(403).json({ message });
    }
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking voting window' });
  }
};

module.exports = checkVotingWindow;