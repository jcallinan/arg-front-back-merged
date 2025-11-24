import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

import { querysClient } from "./services/queryClient";
import { store } from "./store/store";
import { AuthProvider } from "./modules/auth/customhooks/useAuth";
import { TokenTimingProvider } from "./context/TokenTimingContext";
import "./index.scss";
import AppRoutes from "./routes/Approutes";

ReactDOM.createRoot(document.getElementById("root")!).render(
   // <React.StrictMode>
   <Provider store={store}>
      <QueryClientProvider client={querysClient}>
         <TokenTimingProvider>
            <AuthProvider>
               <BrowserRouter>
                  <ConfigProvider
                     theme={{
                        token: {
                           colorPrimaryBorder: "#2d2d2d", // hover/focus border
                           colorPrimaryHover: "#2d2d2d", // button/input hover
                        },
                     }}
                  >
                     <AppRoutes />
                  </ConfigProvider>
               </BrowserRouter>
            </AuthProvider>
         </TokenTimingProvider>
      </QueryClientProvider>
   </Provider>
   // </React.StrictMode>
);
