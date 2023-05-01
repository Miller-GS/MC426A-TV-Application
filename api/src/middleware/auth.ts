import jwt from "jsonwebtoken";
import env from "../../environment";

export default function auth(req, res, next) {
    const authHeader = req.header("authorization");
    if (!authHeader) {
        return res.status(401).json({ msg: "No token, authorization denied." });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, user_token) => {
        if (err) {
            return res.status(403).json({ msg: "Token is not valid." });
        }
        req.user = user_token;
        next();
    });
}