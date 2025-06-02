
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Payment function started');
    
    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData.user;
    console.log('User authenticated:', user.id);

    // Validate request body
    const { voucherType = "premium" } = await req.json();
    
    // Initialize Stripe with enhanced security
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(), // Use secure fetch client
    });

    console.log('Creating Stripe checkout session with enhanced security');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || !emailRegex.test(user.email)) {
      throw new Error("Invalid user email format");
    }

    // Create a one-time payment session with enhanced security
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "WordLens Premium Voucher",
              description: "One-time access voucher for WordLens premium features"
            },
            unit_amount: 200, // $2.00 in cents - validate this amount
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        voucher_type: voucherType,
        user_id: user.id,
        timestamp: new Date().toISOString(),
      },
      // Enhanced security settings
      payment_intent_data: {
        capture_method: 'automatic',
        setup_future_usage: undefined, // Don't store payment method
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes expiry
    });

    console.log('Checkout session created with security measures:', session.id);

    // Return only the URL, no sensitive data
    return new Response(JSON.stringify({ 
      url: session.url,
      expires_at: session.expires_at 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    
    // Don't expose internal errors to client
    const clientError = error.message.includes('not authenticated') || 
                       error.message.includes('Invalid') || 
                       error.message.includes('not configured')
      ? error.message 
      : 'Payment processing temporarily unavailable';
      
    return new Response(JSON.stringify({ error: clientError }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error.message.includes('not authenticated') ? 401 : 500,
    });
  }
});
