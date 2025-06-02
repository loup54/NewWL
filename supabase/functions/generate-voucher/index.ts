
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation utilities
interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'uuid' | 'boolean';
  min?: number;
  max?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

const validateInput = (data: any, rules: ValidationRule[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  for (const rule of rules) {
    const value = data[rule.field];
    
    if (rule.required && (value === undefined || value === null)) {
      errors.push({ field: rule.field, message: `${rule.field} is required` });
      continue;
    }
    
    if (value !== undefined && value !== null) {
      if (rule.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push({ field: rule.field, message: `${rule.field} must be a valid number` });
          continue;
        }
        if (rule.min !== undefined && num < rule.min) {
          errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.min}` });
        }
        if (rule.max !== undefined && num > rule.max) {
          errors.push({ field: rule.field, message: `${rule.field} must not exceed ${rule.max}` });
        }
      }
    }
  }
  
  return errors;
};

// Rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const checkRateLimit = (userId: string, maxRequests = 10, windowMs = 60000): { allowed: boolean; resetTime?: number } => {
  const now = Date.now();
  const key = `voucher_gen:${userId}`;
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }
  
  if (entry.count >= maxRequests) {
    return { allowed: false, resetTime: entry.resetTime };
  }
  
  entry.count++;
  return { allowed: true };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Generate voucher function started with enhanced security');
    
    // Create supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User authenticated:', user.id);

    // Rate limiting check
    const rateLimitResult = checkRateLimit(user.id);
    if (!rateLimitResult.allowed) {
      console.log('Rate limit exceeded for user:', user.id);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Input validation
    const validationRules: ValidationRule[] = [
      { field: 'codeCount', required: false, type: 'number', min: 1, max: 100 },
      { field: 'value', required: false, type: 'number', min: 0.01, max: 1000 }
    ];

    const validationErrors = validateInput(requestBody, validationRules);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validationErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { codeCount = 1, value = 2.00 } = requestBody;

    // Check if user is admin
    const { data: roles, error: roleError } = await supabaseClient
      .rpc('get_user_roles', { _user_id: user.id })

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify user permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!roles?.some((r: any) => r.role === 'admin')) {
      console.log('Access denied - user is not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin access verified, generating secure voucher codes');

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

    console.log('Generated codes, inserting into database');

    // Insert voucher codes with error handling
    const { data, error } = await supabaseClient
      .from('voucher_codes')
      .insert(codes)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create voucher codes in database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Voucher codes created successfully:', data?.length);

    return new Response(
      JSON.stringify({ 
        success: true, 
        codes: data,
        count: codeCount,
        message: `Successfully generated ${codeCount} secure voucher code${codeCount > 1 ? 's' : ''}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
