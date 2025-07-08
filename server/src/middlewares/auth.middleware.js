import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/api-response.js';

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;
        
        if (!token) {
            return res.status(401).json(
                new ApiResponse(401, { error: "Access token required" })
            );
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
        const user = await User.findById(decodedToken.id).select('-personal_info.password');
        
        if (!user) {
            return res.status(401).json(
                new ApiResponse(401, { error: "Invalid access token" })
            );
        }

        req.user = user._id.toString();
        next();
    }
    catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(
                new ApiResponse(401, { error: "Token expired", code: "TOKEN_EXPIRED" })
            );
        }
        return res.status(401).json(
            new ApiResponse(401, { error: "Invalid token" })
        );
    }
}
export {verifyJWT};