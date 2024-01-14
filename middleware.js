const jwt = require("jsonwebtoken");

async function checkAuth(req, res, next){
    let token = req.headers.token;
    jwt.verify(token, process.env.TOKEN, (err, check) => {
        if(check){
            next()
        } else{
            res.status(401).send({success: false, msg: "Unauthorized"})
        }
    })
}

module.exports = checkAuth;