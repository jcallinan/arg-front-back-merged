import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { WindowsFilled } from "@ant-design/icons";
import mainLogo from "@assets/images/logo.svg";
import "./LoginScreen.scss";
import { PrimaryButton } from "@widget-library/Buttons";

const LoginScreen: React.FC = () => {
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Check for error from OAuth callback
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location.state]);

  const handleLoginSubmit = async () => {
    setError(null); // Clear any previous errors
    // Build Microsoft OAuth2 authorization URL from environment variables
    const tenantId = import.meta.env.VITE_MICROSOFT_TENANT_ID;
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    const baseUrl = import.meta.env.VITE_MICROSOFT_OAUTH_BASE_URL;
    const redirectUri = import.meta.env.VITE_MICROSOFT_REDIRECT_URI 
    const responseType = import.meta.env.VITE_MICROSOFT_RESPONSE_TYPE;
    const responseMode = import.meta.env.VITE_MICROSOFT_RESPONSE_MODE;
    const scope = import.meta.env.VITE_MICROSOFT_SCOPE;

    const oauthUrl = `${baseUrl}/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&response_mode=${responseMode}&scope=${scope}`;
    
    window.location.href = oauthUrl;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={mainLogo} alt="ARG Logo" className="logo" />
        </div>

        <div className="login-form">
          {error && (
            <div style={{ 
              marginBottom: '16px', 
              padding: '12px', 
              backgroundColor: '#fff2f0', 
              border: '1px solid #ffccc7', 
              borderRadius: '6px',
              color: '#cf1322'
            }}>
              {error}
            </div>
          )}
          <PrimaryButton
            name="login-with-microsoft"
            label={<><WindowsFilled style={{ marginRight: 8 }} />Login with Microsoft</>}
            onClick={handleLoginSubmit}
            loading={isLoading}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <p className="sub-title">You'll be Redirected to Microsoft's Secure Login</p>
          <p className="span-caption margin-top">Your data is protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;