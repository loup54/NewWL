import { useState } from 'react';
import { testSupabaseConnection } from '../lib/supabase/test-connection';

export function SupabaseTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const isConnected = await testSupabaseConnection();
      setTestResult(isConnected ? 'Connection successful!' : 'Connection failed');
    } catch (error) {
      setTestResult('Error testing connection');
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      <button
        onClick={handleTest}
        disabled={isTesting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isTesting ? 'Testing...' : 'Test Connection'}
      </button>
      {testResult && (
        <p className={`mt-4 ${testResult.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {testResult}
        </p>
      )}
    </div>
  );
} 