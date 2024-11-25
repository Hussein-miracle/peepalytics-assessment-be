import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

class AuthMiddleware {
    static authenticate(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required',status:false });
        }

        try {
            const decoded = jwt.verify(token, <string>process.env.JWT_SECRET);
            
            // Attach user to request for further use
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    }

    // Optional: Generate token for authenticated users
    static generateToken(userId: string) {
        return jwt.sign({ id: userId }, <string>process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
    }
}

export default AuthMiddleware;