const jwt = require("jsonwebtoken");

async function checkAuth(req, res, next) {
    let token = req.headers.token;
    if (!token) {
        return res.status(401).send({ success: false, msg: "Unauthorized: Token missing" });
    }

    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ success: false, msg: "Unauthorized: Invalid token" });
        }
        req.user = decoded; // Attach decoded user information to the request object
        next(); // Proceed to the next middleware
    });
}

module.exports = checkAuth;
