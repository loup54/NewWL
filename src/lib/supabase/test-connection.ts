import { supabase } from './client';

export async function testSupabaseConnection() {
  try {
    // Test the connection by getting the current user (should be null if not logged in)
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    console.log('Current user:', data.user);
    return true;
  } catch (error) {
    console.error('Unexpected error testing Supabase connection:', error);
    return false;
  }
} 