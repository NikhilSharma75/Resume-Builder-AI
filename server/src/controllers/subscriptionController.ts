// import { Request, Response } from 'express';
// import Stripe from 'stripe';
// import User from '../models/User';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//     apiVersion: '2025-01-27.acacia' as any,
// });

// // @desc    Create Stripe Checkout Session
// // @route   POST /api/subscriptions/checkout
// // @access  Private
// export const createCheckoutSession = async (req: Request, res: Response) => {
//     try {
//         // @ts-ignore
//         const user = req.user;

//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             customer_email: user.email,
//             line_items: [
//                 {
//                     price: process.env.STRIPE_PRO_PRICE_ID,
//                     quantity: 1,
//                 },
//             ],
//             mode: 'subscription',
//             success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?payment=success`,
//             cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?payment=cancelled`,
//             metadata: {
//                 userId: user._id.toString(),
//             },
//         });

//         res.json({ id: session.id, url: session.url });
//     } catch (error: any) {
//         console.error('Stripe Session Error:', error);
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Stripe Webhook Handler
// // @route   POST /api/subscriptions/webhook
// // @access  Public
// export const handleWebhook = async (req: Request, res: Response) => {
//     const sig = req.headers['stripe-signature'] as string;
//     let event: Stripe.Event;

//     console.log('Webhook received, signature:', sig);

//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET || ''
//         );
//         console.log('Event constructed successfully:', event.type);
//     } catch (err: any) {
//         console.error(`Webhook Error: ${err.message}`);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const session = event.data.object as Stripe.Checkout.Session;
//             const userId = session.metadata?.userId;
//             const customerId = session.customer as string;
//             const subscriptionId = session.subscription as string;

//             console.log('Checkout session completed for user:', userId, 'Customer:', customerId, 'Subscription:', subscriptionId);

//             if (userId) {
//                 const updatedUser = await User.findByIdAndUpdate(userId, {
//                     isSubscribed: true,
//                     stripeCustomerId: customerId,
//                     stripeSubscriptionId: subscriptionId,
//                 }, { new: true });
//                 console.log('User updated successfully:', updatedUser?.email, 'isSubscribed:', updatedUser?.isSubscribed);
//             } else {
//                 console.warn('No userId found in session metadata');  
//             }
//             break;          

//         case 'customer.subscription.created':
//         case 'customer.subscription.updated':
//             const sub = event.data.object as Stripe.Subscription;
//             const subUserId = sub.metadata?.userId;
//             if (subUserId && sub.status === 'active') {
//                 await User.findByIdAndUpdate(subUserId, { isSubscribed: true });
//                 console.log('Subscription updated/created for user:', subUserId);
//             }
//             break;  

//         case 'customer.subscription.deleted':
//             const subscription = event.data.object as Stripe.Subscription;
//             console.log('Subscription deleted:', subscription.id);
//             const userSub = await User.findOne({ stripeSubscriptionId: subscription.id });
//             if (userSub) {
//                 userSub.isSubscribed = false;
//                 userSub.stripeSubscriptionId = undefined;
//                 await userSub.save();
//                 console.log('User subscription status revoked for:', userSub.email);
//             }
//             break;

//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     res.json({ received: true });
// };

// // @desc    Sync user subscription status with Stripe (Fallback)
// // @route   POST /api/subscriptions/sync
// // @access  Private
// export const syncSubscription = async (req: Request, res: Response) => {
//     try {
//         // @ts-ignore
//         const userId = req.user._id;
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Search for active subscriptions for this user's email
//         const customers = await stripe.customers.list({
//             email: user.email,
//             limit: 1,
//         });

//         if (customers.data.length === 0) {
//             return res.json({ 
//                 isSubscribed: false, 
//                 message: 'No Stripe customer found for this email.' 
//             });
//         }

//         const customerId = customers.data[0].id;
//         const subscriptions = await stripe.subscriptions.list({
//             customer: customerId,
//             status: 'active',
//             limit: 1,
//         });

//         if (subscriptions.data.length > 0) {
//             // Update user status
//             user.isSubscribed = true;
//             user.stripeCustomerId = customerId;
//             user.stripeSubscriptionId = subscriptions.data[0].id;
//             await user.save();

//             return res.json({ 
//                 isSubscribed: true, 
//                 message: 'Subscription synced successfully!' 
//             });
//         }

//         res.json({ 
//             isSubscribed: false, 
//             message: 'No active subscription found on Stripe.' 
//         });
//     } catch (error: any) {
//         console.error('Sync Error:', error);
//         res.status(500).json({ message: error.message });
//     }
// };


////////////////////
import { Request, Response } from 'express';
import Stripe from 'stripe';
import User from '../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia' as any,
});

// @desc    Create Stripe Checkout Session
// @route   POST /api/subscriptions/checkout
// @access  Private
export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price: process.env.STRIPE_PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?payment=success`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?payment=cancelled`,
            metadata: {
                userId: user._id.toString(),
                plan: 'pro', // ✅ important for future scaling
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe Webhook Handler
// @route   POST /api/subscriptions/webhook
// @access  Public
export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            // ✅ USER SUBSCRIBED
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                if (userId) {
                    const updatedUser = await User.findByIdAndUpdate(
                        userId,
                        {
                            isSubscribed: true, // keep for backward compatibility
                            plan: 'pro',
                            credits: 100,
                            stripeCustomerId: customerId,
                            stripeSubscriptionId: subscriptionId,
                        },
                        { new: true }
                    );

                    console.log('User upgraded to PRO:', updatedUser?.email);
                }
                break;
            }

            // ✅ SUBSCRIPTION ACTIVE / UPDATED
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const sub = event.data.object as Stripe.Subscription;
                const subUserId = sub.metadata?.userId;

                if (subUserId && sub.status === 'active') {
                    await User.findByIdAndUpdate(subUserId, {
                        isSubscribed: true,
                        plan: 'pro',
                        credits: 100,
                    });

                    console.log('Subscription active for user:', subUserId);
                }
                break;
            }

            // ❌ SUBSCRIPTION CANCELLED
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                const user = await User.findOne({
                    stripeSubscriptionId: subscription.id,
                });

                if (user) {
                    user.isSubscribed = false;
                    user.plan = 'free';
                    user.credits = 10; // reset free credits
                    user.stripeSubscriptionId = undefined;

                    await user.save();

                    console.log('User downgraded to FREE:', user.email);
                }
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sync user subscription status with Stripe (Fallback)
// @route   POST /api/subscriptions/sync
// @access  Private
export const syncSubscription = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find Stripe customer
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1,
        });

        if (customers.data.length === 0) {
            return res.json({
                isSubscribed: false,
                plan: 'free',
                credits: user.credits,
                message: 'No Stripe customer found.',
            });
        }

        const customerId = customers.data[0].id;

        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1,
        });

        if (subscriptions.data.length > 0) {
            user.isSubscribed = true;
            user.plan = 'pro';
            user.credits = user.credits < 20 ? 100 : user.credits; // safety refill
            user.stripeCustomerId = customerId;
            user.stripeSubscriptionId = subscriptions.data[0].id;

            await user.save();

            return res.json({
                isSubscribed: true,
                plan: 'pro',
                credits: user.credits,
                message: 'Subscription synced successfully!',
            });
        }

        // No active subscription
        user.isSubscribed = false;
        user.plan = 'free';

        await user.save();

        return res.json({
            isSubscribed: false,
            plan: 'free',
            credits: user.credits,
            message: 'No active subscription found.',
        });
    } catch (error: any) {
        console.error('Sync Error:', error);
        res.status(500).json({ message: error.message });
    }
};