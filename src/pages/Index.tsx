
import React from 'react';

const Index = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '16px'
        }}>
          WordLens
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '32px'
        }}>
          Document Analysis Tool
        </p>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            color: '#374151',
            marginBottom: '24px',
            fontSize: '16px'
          }}>
            Welcome to WordLens - Your document analysis tool is ready.
          </p>
          <button 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={() => alert('WordLens is working on iOS 18.5!')}
          >
            Test App
          </button>
        </div>
        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#dbeafe',
          borderRadius: '8px',
          border: '1px solid #93c5fd'
        }}>
          <p style={{ 
            color: '#1e40af',
            fontSize: '14px',
            margin: 0
          }}>
            ✅ This is a simplified version for iOS 18.5 compatibility testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
