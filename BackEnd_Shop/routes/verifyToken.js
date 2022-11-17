const jwt = require('jsonwebtoken');

//jwt.verify(token, secretOrPublicKey, [options, callback])


const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        //jwt.verify(token, secretOrPublicKey, [options, callback])
        jwt.verify(token, process.env.JWT_SEC, (err,user)=>{
            if (err) {
                res.status(403).json("Token not valid")
            } else {
                req.user = user;
                next()
            }
        })
    } else {
        return res.status(401).json("You are authenticated")
    }

}

const verifyTokenAndAuthorization = (req,res,next)=>{
    //check if token belongs to client or admin
    verifyToken(req,res,()=>{ 
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('you are not allowed to perform such operation') 
        }
    })
    
}


//admin
const verifyTokenAndAdmin = (req,res,next)=>{
    //check if token belongs to client or admin
    verifyToken(req,res,()=>{ 
        if ( req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('you are not allowed to perform such operation') 
        }
    })
    
}

module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}