import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './customhooks/useAuth';
import SpinLoader from '@widget-library/Loader';

/**
 * OAuth Callback Component
 * Handles the OAuth callback from Microsoft and extracts the access token
 */
const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract token from URL parameters or hash
        const urlParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(location.hash.substring(1));
        
        // Check for access token in different possible locations
        let accessToken = urlParams.get('access_token') || 
                         hashParams.get('access_token') ||
                         urlParams.get('code') ||
                         urlParams.get('token') ||
                         urlParams.get('jwt'); 
        
        if (accessToken) {
          // Handle the OAuth callback with the token
          await handleOAuthCallback(accessToken);
          
          // Get the intended destination from state or default to accounts-payable
          const from = location.state?.from?.pathname || '/accounts-payable';
          console.log('✅ Redirecting to:', from);
          navigate(from, { replace: true });
        } else {
          // No token found, check for error
          const error = urlParams.get('error') || hashParams.get('error');
          const errorDescription = urlParams.get('error_description') || 
                                 hashParams.get('error_description');
          
          console.error('❌ OAuth callback error:', error, errorDescription);
          console.log('❌ No token/code found in URL parameters');
          
          // Redirect to login with error message
          navigate('/login', { 
            replace: true, 
            state: { 
              error: errorDescription || 'Authentication failed. Please try again.' 
            }
          });
        }
      } catch (error) {
        console.error('❌ Error handling OAuth callback:', error);
        navigate('/login', { 
          replace: true, 
          state: { 
            error: 'Authentication failed. Please try again.' 
          }
        });
      }
    };

    handleCallback();
  }, [location, navigate, handleOAuthCallback]);

  return (
    <div className="flex-all" style={{ height: '100vh' }}>
      <SpinLoader size="large" />
      <p style={{ marginTop: '16px', color: '#666' }}>
        Completing authentication...
      </p>
    </div>
  );
};

export default OAuthCallback;