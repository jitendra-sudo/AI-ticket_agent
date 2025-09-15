import jwt from 'jsonwebtoken';

const Authorization = ( req ,res , next) =>{
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({ error: "No token provided" });
    }

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error in Authorization middleware:", error);
        res.status(403).json({ error: "Invalid token" });
    }
}

export default Authorization;