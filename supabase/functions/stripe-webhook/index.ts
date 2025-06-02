
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!stripeKey || !webhookSecret) {
      console.error('Missing Stripe configuration')
      return new Response('Server configuration error', { status: 500 })
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })
    
    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature provided', { status: 400 })
    }

    const body = await req.text()
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    console.log('Verified webhook event:', event.type)

    // Create supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment completed for session:', session.id)
        
        // Verify payment was successful
        if (session.payment_status === 'paid') {
          const metadata = session.metadata
          
          if (metadata?.voucher_type === 'premium') {
            // Generate voucher code for successful payment
            const randomBytes = new Uint8Array(6)
            crypto.getRandomValues(randomBytes)
            const randomPart = Array.from(randomBytes)
              .map(b => b.toString(36).padStart(2, '0'))
              .join('')
              .toUpperCase()
              .slice(0, 8)
            
            const voucherCode = `PAID-${randomPart}`
            
            // Store voucher in database
            const { error: voucherError } = await supabaseClient
              .from('voucher_codes')
              .insert({
                code: voucherCode,
                value: 2.00,
                status: 'active',
                created_by: metadata.user_id || null
              })

            if (voucherError) {
              console.error('Failed to create voucher:', voucherError)
            } else {
              console.log('Created voucher code:', voucherCode)
            }
          }
        }
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        break
      }
      
      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response('Webhook processed successfully', { 
      status: 200,
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response('Webhook processing failed', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
