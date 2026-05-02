import Stripe from 'stripe';
import userModel from '../models/userModel.js';

// Initialize Stripe (will throw an error if key is missing, which is fine to catch misconfigurations early)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

/**
 * Endpoint to create a SetupIntent for a user.
 * It ensures the user has a Stripe Customer ID, creates one if not,
 * and then generates a SetupIntent client_secret.
 */
export const createSetupIntent = async (req, res) => {
    try {
        const { userId } = req.body; // Assuming the authMiddleware adds userId to the req body or it's passed

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        // 1. Fetch user from database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // 2. Check if user already has a Stripe Customer ID
        let customerId = user.stripeCustomerId;

        // 3. If not, create a new Stripe Customer
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user._id.toString()
                }
            });
            customerId = customer.id;
            
            // Save the customer ID to the database
            user.stripeCustomerId = customerId;
            await user.save();
        }

        // 4. Create a SetupIntent for this customer
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
        });

        // 5. Return the client_secret to the frontend
        res.json({
            success: true,
            clientSecret: setupIntent.client_secret,
        });

    } catch (error) {
        console.error('Error creating SetupIntent:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Fetch all saved payment methods for a user
 */
export const getSavedPaymentMethods = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        if (!user || !user.stripeCustomerId) {
            return res.json({ success: true, paymentMethods: [] });
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card',
        });

        res.json({ success: true, paymentMethods: paymentMethods.data });

    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.json({ success: false, message: error.message });
    }
};
