
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';

// interface DecodedToken {
//     id: string;
//     iat: number;
//     exp: number;
// }

// export const protect = async (req: Request, res: Response, next: NextFunction) => {
//     let token;

//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(
//                 token,
//                 process.env.JWT_SECRET || 'secret'
//             ) as DecodedToken;

//             // @ts-ignore
//             req.user = await User.findById(decoded.id).select('-password');
//             return next(); // ✅ ADD RETURN
//         } catch (error) {
//             console.error(error);
//             return res.status(401).json({ message: 'Not authorized, token failed' }); // ✅ ADD RETURN
//         }
//     }

//     if (!token) {
//         return res.status(401).json({ message: 'Not authorized, no token' }); // ✅ ADD RETURN
//     }
// };



// /////
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';

// interface DecodedToken {
//     id: string;
//     iat: number;
//     exp: number;
// }

// export const protect = async (req: Request, res: Response, next: NextFunction) => {
//     let token;

//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(
//                 token,
//                 process.env.JWT_SECRET || 'secret'
//             ) as DecodedToken;

//             // @ts-ignore
//             req.user = await User.findById(decoded.id).select('-password');

//             // ✅ FIX: if the user tied to this token no longer exists
//             // (e.g. token issued against a different/old database), reject cleanly
//             if (!req.user) {
//                 return res.status(401).json({ message: 'Not authorized, user not found' });
//             }

//             return next();
//         } catch (error) {
//             console.error(error);
//             return res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         return res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

////////
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

// ✅ Local interface so req.user is a known property throughout this function
interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'secret'
            ) as DecodedToken;

            req.user = await User.findById(decoded.id).select('-password');

            // ✅ FIX: if the user tied to this token no longer exists
            // (e.g. token issued against a different/old database), reject cleanly
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};