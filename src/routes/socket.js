const express = require("express");
const router = express.Router();
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Session = require("../models/Session");
const { isAuthenticate } = require('../middlewire/common');

function SocketRouter(io) {
    router.post("/active", isAuthenticate, async(req, res) => {
        const { _id } = req.query;
        io.emit(`${_id}`, { join: true, end: false });
        return res.status(201).json({
            success: true,
            message: "Active"
        }); 
    })

    router.post("/ended", isAuthenticate, async(req, res) => {
        const { user } = req.user;
        const { _id } = req.query;
        const session = await Session.findById(_id);
        
        if(session.join && session.engaged){
            let updates = {
                status: "COMPLETED"
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
                        io.emit(`${_id}`, { join: false, end: true });
                        return res.status(201).json({
                            completed: true,
                            session,
                            message: "Session completed"
                        });  
                    }
                }
            )
        }else{
            io.emit(`${_id}`, { join: false, end: true });
            return res.status(201).json({
                completed: false,
                message: "Session completed"
            });  
        }
    })

    router.post("/joining", async(req, res) => {
        const { _id, user } = req.query;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const session = await Session.findById(_id);

        if(session.join && session.expires - 3660 > currentTimestamp){
            
            let updates = {};

            if(user === session._owner.toString()){
                updates.join = true
            }

            if(user !== session._owner.toString()){
                updates.engaged = true
            }

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
                        io.emit(`${_id}`, { join: true, end: false });
                        return res.status(201).json({
                            success: true,
                            session,
                            message: "Session is ready"
                        });  
                    }
                }
            )
 
        }else{
            const appID = process.env.APP_ID; 
            const appCertificate = process.env.APP_CRETIFICATE;
            const channel = _id;
            const role = RtcRole.PUBLISHER;
            const expirationTimeInSeconds = 3600 * 12;
            const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        
            const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, 0, role, privilegeExpiredTs);
        
            let updates = {
                expires: privilegeExpiredTs,
                agora: {
                    appId: process.env.APP_ID,
                    channel: _id,
                    token
                }
            };

            if(user === session._owner.toString()){
                updates.join = true
            }

            if(user !== session._owner.toString()){
                updates.engaged = true
            }

            // return res.send(updates);

            // console.log("Nomiro");

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
                        io.emit(`${_id}`, { join: true, end: false });
                        return res.status(201).json({
                            success: true,
                            session,
                            message: "Session is ready"
                        });  
                    }
                }
            )
        }

    });

    return router;
}

module.exports = SocketRouter;
