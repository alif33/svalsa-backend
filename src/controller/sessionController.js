const Session = require("../models/Session");

exports.getSessions = async(req, res) => {
    
 const { _id }= req.user; 
 const participateSessions = await Session.find({
   status: "BOOK",
   _participator: _id
 })
 .populate("_owner", "_id userName firstName lastName email")
 .populate("_participator", "_id userName firstName lastName email");

 const _ownSessions = await Session.find({
   status: "BOOK",
   _owner: _id
 })
 .populate("_owner", "_id userName firstName lastName email")
 .populate("_participator", "_id userName firstName lastName email");


 const ownSessions = await Session.find({
   status: "OPEN",
   _owner: _id
 })
 .populate("_owner", "_id userName firstName lastName email")
 .populate("_participator", "_id userName firstName lastName email");

 const sessions = await Session.find({
   status: "OPEN"
 })
 .populate("_owner", "_id userName firstName lastName email");

 const completedSessions = await Session.find({
    status: "COMPLETED",
    _owner: _id
  })
  .populate("_owner", "userName firstName lastName")
  .populate("_participator", "userName firstName lastName");


 res.json({
   participateSessions: participateSessions.reverse(),
   _ownSessions: _ownSessions.reverse(),
   ownSessions: ownSessions.reverse(),
   sessions: sessions.reverse(),
   completedSessions: completedSessions.reverse()
 });

}

exports.ownSessions = async(req, res) => {
    
 const { _id }= req.user; 
 const sessions = await Session.find({
   status: "COMPLETED",
   _owner: _id
 })
 .populate("_owner", "userName firstName lastName")
 .populate("_participator", "userName firstName lastName");

 res.json({
    sessions: sessions.reverse()
 });

}


exports.getSession = async(req, res) => {
    const { _id } = req.query;
    const session = await Session
            .findById(_id)
            .populate("_owner", "userName firstName lastName")
            .populate("_participator", "userName firstName lastName");
    res.send(session);
}

exports.addSession = async(req, res) => {
  const { _time, _date, _note } = req.body;
  const { _id } = req.user;

  const _session = new Session({
      _time,
      _date, 
      _note,
      _owner: _id
  });

  if(await _session.save()){
      res.send({
          success: true,
          message: 'Session added successfully'
      })
  }
}

exports.addComment = async(req, res) => {
    const { _id } = req.query;
    const { comment, rating } = req.body;

    let updates = {
        comment, 
        rating
    };
    Session.findOneAndUpdate(
        { _id }, 
        { $set: updates },
        { returnOriginal: false },
        (err, session)=>{
            if(err){
                return res.status(400).json({
                    err,
                    message: "Something went wrong",
                });
            }
            
            if(session){
                return res.status(201).json({
                    success: true
                });
            }
        }
    ) 
}

exports.manageSession = async(req, res) => {
  const { _id, status, _participator } = req.query;

    let updates = {
        status,
        _participator
    };

    Session.findOneAndUpdate(
        { _id }, 
        { $set: updates },
        { returnOriginal: false },
        (err, session)=>{
            if(err){
                return res.status(400).json({
                    err,
                    message: "Something went wrong",
                });
            }
            let message="";

            if(status==="BOOK"){
                message = "You\'re enrolled"
            }

            if(status==="OPEN"){
                message = "Session is cancelled"
            }

            if(status==="CANCELLED"){
                message = "Session is cancelled"
            }
            if(session){
                return res.status(201).json({
                    success: true,
                    message
                });
            }
        }
    ) 
}
