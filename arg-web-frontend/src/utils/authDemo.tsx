import React from 'react';
import { useAuth } from '@/modules/auth/customhooks/useAuth';
import { getAccessToken, getAllCookies } from '@/utils/cookieUtils';

/**
 * Demo component to show authentication state and cookie information
 * This is for testing purposes and can be removed in production
 */
const AuthDemo: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const accessToken = getAccessToken();
  const allCookies = getAllCookies();

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Authentication Status</h3>
      <div style={{ marginBottom: '10px' }}>
        <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
      </div>
      
      {user && (
        <div style={{ marginBottom: '10px' }}>
          <strong>User:</strong> {user.name} ({user.email})
        </div>
      )}
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Access Token in Cookie:</strong> {accessToken ? 'Present' : 'Not found'}
      </div>
      
      {accessToken && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Token Value:</strong> {accessToken.substring(0, 20)}...
        </div>
      )}
      
      <div style={{ marginBottom: '10px' }}>
        <strong>All Cookies:</strong>
        <pre style={{ fontSize: '12px', backgroundColor: '#fff', padding: '8px', borderRadius: '4px' }}>
          {JSON.stringify(allCookies, null, 2)}
        </pre>
      </div>
      
      {isAuthenticated && (
        <button 
          onClick={logout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout (Clear Cookie)
        </button>
      )}
    </div>
  );
};

export default AuthDemo;
