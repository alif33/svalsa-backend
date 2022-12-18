const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Session = require("../models/Session");
exports.generateToken = async(req, res) => {

    const { _id } = req.query;
    
    const session = await Session.findById(_id);
    if(session.live){
        return res.status(201).json({
            success: true,
            session,
            message: "Session is ready"
        });  
    }else{
        const appID = process.env.APP_ID; 
        const appCertificate = process.env.APP_CRETIFICATE;
        const channel = _id;
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    
        const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, 0, role, privilegeExpiredTs);
    
        const updates = {
            live: true,
            agora: {
                appId: process.env.APP_ID,
                channel: _id,
                token
            }
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
                        success: true,
                        session,
                        message: "Session is ready"
                    });  
                }
            }
        )
    }
}