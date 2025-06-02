
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: roles, error: roleError } = await supabaseClient
      .rpc('get_user_roles', { _user_id: user.id })

    if (roleError || !roles?.some((r: any) => r.role === 'admin')) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { codeCount = 1, value = 2.00 } = await req.json()

    // Validate input
    if (codeCount < 1 || codeCount > 100) {
      return new Response(
        JSON.stringify({ error: 'Code count must be between 1 and 100' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (value < 0.01 || value > 1000) {
      return new Response(
        JSON.stringify({ error: 'Value must be between $0.01 and $1000' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate secure voucher codes
    const codes = []
    for (let i = 0; i < codeCount; i++) {
      // Generate cryptographically secure random code
      const randomBytes = new Uint8Array(6)
      crypto.getRandomValues(randomBytes)
      const randomPart = Array.from(randomBytes)
        .map(b => b.toString(36).padStart(2, '0'))
        .join('')
        .toUpperCase()
        .slice(0, 8)
      
      const code = `FREE-${randomPart}`
      codes.push({
        code,
        value,
        created_by: user.id
      })
    }

    // Insert voucher codes
    const { data, error } = await supabaseClient
      .from('voucher_codes')
      .insert(codes)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate voucher codes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        codes: data,
        count: codeCount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
