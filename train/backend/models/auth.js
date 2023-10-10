
const jwt = require("jsonwebtoken");

const auth = {
    createToken: function(req, res) {
        let payload = { data: "JavaScript är bra" };
        let jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.json({
            data: {
                type: "success",
                message: "Token created.",
                user: payload,
                token: jwtToken
            }
        });
    },

    checkToken: function(req, res, next) {
        var token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, function(err) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                next();

                return undefined;
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
};

module.exports = auth;
