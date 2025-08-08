const Party = require('../model/party');
const Candidate = require('../model/candidate');

/**
 * Middleware to check if the voting window is currently open for a candidate's party.
 * This version correctly handles time zone differences.
 */
const checkVotingWindow = async (req, res, next) => {
  try {
    const { candidateID } = req.params;
    const candidate = await Candidate.findById(candidateID);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const party = await Party.findOne({ name: candidate.party });

    if (!party || !party.startTime || !party.endTime) {
      return res.status(400).json({ message: 'This party does not have a valid election schedule configured.' });
    }

    // Get the current time on the server (which is in UTC)
    const now = new Date(); 
    
    // Get the start and end times from the database. 
    // new Date() will parse the stored string into a Date object.
    const startTime = new Date(party.startTime);
    const endTime = new Date(party.endTime);
    
    // Log the times for debugging purposes (optional but helpful)
    console.log(`Current Server Time (UTC): ${now.toISOString()}`);
    console.log(`Election Start Time (UTC): ${startTime.toISOString()}`);
    console.log(`Election End Time (UTC):   ${endTime.toISOString()}`);

    // Perform the comparison
    if (now < startTime || now > endTime) {
      const message = now < startTime 
        ? `Voting has not yet started for this party. It will open at ${startTime.toLocaleString()}.`
        : `Voting has closed for this party. It ended at ${endTime.toLocaleString()}.`;
      return res.status(403).json({ message });
    }
    
    // If the time is valid, proceed to the voting logic
    next();
  } catch (err) {
    console.error('Error in checkVotingWindow middleware:', err);
    res.status(500).json({ message: 'Internal Server Error while checking voting window.' });
  }
};

module.exports = checkVotingWindow;