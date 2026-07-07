// import { Request, Response } from 'express';
// import User from '../models/User';
// import bcrypt from 'bcryptjs'; // Need to install this
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import sendEmail from '../config/sendemail';


// // Add interface for Request with user
// interface AuthRequest extends Request {
//     user?: any;
// }


// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// export const registerUser = async (req: Request, res: Response) => {
//     const { name, email, password } = req.body;

//     try {
//         const userExists = await User.findOne({ email });

//         if (userExists) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         if (user) {
//             res.status(201).json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 token: generateToken(user._id.toString()),
//             });
//         } else {
//             res.status(400).json({ message: 'Invalid user data' });
//         }
//     } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Auth user & get token
// // @route   POST /api/auth/login
// // @access  Public
// export const loginUser = async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     try {
//         if (email === 'admin@example.com' && password === 'admin123') {
//             let adminUser = await User.findOne({ email });
//             if (!adminUser) {
//                 const salt = await bcrypt.genSalt(10);
//                 const hashedPassword = await bcrypt.hash(password, salt);
//                 adminUser = await User.create({
//                     name: 'admin',
//                     email,
//                     password: hashedPassword,
//                     role: 'admin'
//                 });
//             }
//             return res.json({
//                 _id: adminUser._id,
//                 name: adminUser.name,
//                 email: adminUser.email,
//                 role: 'admin',
//                 token: generateToken(adminUser._id.toString()),
//             });
//         }

//         const user = await User.findOne({ email });

//         if (user && user.password && (await bcrypt.compare(password, user.password))) {
//             res.json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 token: generateToken(user._id.toString()),
//             });
//         } else {
//             res.status(401).json({ message: 'Invalid email or password' });
//         }
//     } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private
// export const getMe = async (req: AuthRequest, res: Response) => {
//     const user = await User.findById(req.user._id)
//         .select('-password -stripeCustomerId -stripeSubscriptionId');

//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     const userObj = user.toObject();

//     // ✅ KEY FIX
//    return res.status(200).json({
//     ...userObj,
//     isUnlimited: user.isSubscribed
// });

// };
// // @desc    Refresh token
// // @route   POST /api/auth/refresh
// // @access  Private
// export const refreshToken = async (req: AuthRequest, res: Response) => {


//     if (req.user) {
//         res.status(200).json({
//             token: generateToken(req.user._id.toString()),
//             _id: req.user._id,
//             name: req.user.name,
//             email: req.user.email
//         });
//     } else {
//         res.status(401).json({ message: 'Not authorized' });
//     }
// };

// // @desc    Forgot password
// // @route   POST /api/auth/forgotpassword
// // @access  Public
// export const forgotPassword = async (req: Request, res: Response) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Generate reset token
//         const resetToken = crypto.randomBytes(20).toString('hex');

//         // Hash token and set to resetPasswordToken field
//         user.resetPasswordToken = crypto
//             .createHash('sha256')
//             .update(resetToken)
//             .digest('hex');

//         // Set expire (10 minutes)
//         user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

//         await user.save();

//         // Create reset URL
//         const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

       

// const message = `
// You are receiving this email because you requested a password reset.

// Click the link below to reset your password (valid for 10 minutes):

// ${resetUrl}

// If you did not request this, please ignore this email and your password will remain unchanged.
// `;
//         try {
//             await sendEmail({
//                 email: user.email,
//                 subject: 'Password reset token',
//                 message,
//             });

//             res.status(200).json({ success: true, data: 'Email sent' });
//         } catch (error) {
//             console.log(error);
//             user.resetPasswordToken = undefined;
//             user.resetPasswordExpire = undefined;

//             await user.save();

//             return res.status(500).json({ message: 'Email could not be sent' });
//         }
//     } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Reset password
// // @route   PUT /api/auth/resetpassword/:resettoken
// // @access  Public
// export const resetPassword = async (req: Request, res: Response) => {
//     // Get hashed token
//     const resetPasswordToken = crypto
//         .createHash('sha256')
//         .update(req.params.resettoken)
//         .digest('hex');

//     const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//         return res.status(400).json({ message: 'Invalid token or token expired' });
//     }

//     // Set new password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(req.body.password, salt);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     res.status(200).json({
//         success: true,
//         data: 'Password reset success',
//         token: generateToken(user._id.toString()),
//     });
// };

// const generateToken = (id: string) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
//         expiresIn: '30d',
//     });
// };


///
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs'; // Need to install this
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../config/sendemail';


// Add interface for Request with user
interface AuthRequest extends Request {
    user?: any;
}


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (email === 'admin@example.com' && password === 'admin123') {
            let adminUser = await User.findOne({ email });
            if (!adminUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                adminUser = await User.create({
                    name: 'admin',
                    email,
                    password: hashedPassword,
                    role: 'admin'
                });
            }
            return res.json({
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: 'admin',
                token: generateToken(adminUser._id.toString()),
            });
        }

        const user = await User.findOne({ email });

        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        // ✅ FIX: guard against req.user being null/undefined
        // (happens if the JWT is valid but the user no longer exists in this DB,
        // e.g. after switching MongoDB connection strings)
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await User.findById(req.user._id)
            .select('-password -stripeCustomerId -stripeSubscriptionId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userObj = user.toObject();

        return res.status(200).json({
            ...userObj,
            isUnlimited: user.isSubscribed
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
export const refreshToken = async (req: AuthRequest, res: Response) => {


    if (req.user) {
        res.status(200).json({
            token: generateToken(req.user._id.toString()),
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        });
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;



const message = `
You are receiving this email because you requested a password reset.

Click the link below to reset your password (valid for 10 minutes):

${resetUrl}

If you did not request this, please ignore this email and your password will remain unchanged.
`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error) {
            console.log(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid token or token expired' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        data: 'Password reset success',
        token: generateToken(user._id.toString()),
    });
};

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};