const Photo = require('../models/photo.model');
const Voter = require('../models/voter.model')
const { validate, escape } = require('../middleware')

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {
  try {
    /* Validate and sanitize text input values */
    const error = validate(req.fields)
    if (error) {
      throw `Validation unsuccessful. ${error}`
    }
    
    for (const field in req.fields) {
      escape(field)
    }

    const { title, author, email } = req.fields;
    const file = req.files.file;

    /* Isolate filename */
    const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
    const acceptedFileExtensions = ['jpg', 'jpeg', 'png', 'gif']
    const fileNameExtension = fileName.match(/([^.]+)$/g)[0]
  
    if (!acceptedFileExtensions.includes(fileNameExtension)) {  
      throw 'Invalid file extension!';
    }
    else {
      const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
      await newPhoto.save(); // ...save new photo in DB
      res.json(newPhoto);
    }
  }
  
  catch(err) {
    res.status(500).json(err);
  }
};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {
  try {
    const chosenPhoto = req.params.id
    const photoToUpdate = await Photo.findOne({ _id: chosenPhoto });
    
    if(!photoToUpdate) res.status(404).json({ message: 'Not found' });
    else {
      const voter = await Voter.findOne({ user: req.clientIp })
      
      if (!voter) {
        newVoter = new Voter({ user: req.clientIp, votes: [ chosenPhoto ] })
        await newVoter.save()
      }
      else {
        if (voter.votes.includes(chosenPhoto)) {
          res.status(500).json({ message: 'Already voted!' })
        }
        else {
          voter.votes.push(chosenPhoto)
          await voter.save()
          photoToUpdate.votes++;
          photoToUpdate.save();
          res.send({ message: 'OK' });
        }
      }
    }
  } 
  catch(err) {
    res.status(500).json(err);
  }
};
