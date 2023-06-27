import jwt from "jsonwebtoken";
import env from "../../environment";

export default function auth(req, res, next) {
    const token = getAuthToken(req);
    if (!token)
        return res.status(401).json({ msg: "No token, authorization denied." });

    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, user_token) => {
        if (err) {
            return res.status(403).json({ msg: "Token is not valid." });
        }
        req.user = user_token;
        next();
    });
}

export function optionalAuth(req, res, next) {
    const token = getAuthToken(req);
    if (!token) return next();

    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, user_token) => {
        if (!err) req.user = user_token;
        next();
    });
}

function getAuthToken(req) {
    const authHeader = req.header("authorization");
    if (
        !authHeader ||
        authHeader.split(" ").length != 2 ||
        authHeader.split(" ")[0] != "Bearer"
    ) {
        return null;
    }
    return authHeader.split(" ")[1];
}
