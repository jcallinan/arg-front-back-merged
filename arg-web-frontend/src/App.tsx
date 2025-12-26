import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "./core/Header";
import Footer from "./core/Footer"; 
import Sidemenu from "./core/Sidemenu";
import ModalContainer from "@widget-library/ModalContainer";
import "./App.scss";

const { Content } = Layout;

export default function App() {
  return (
    <Layout className="app-layout">
      <Sidemenu />
      <Layout className="main-layout">
        <Header />
        <Content className="main-content">
          <Outlet />
        </Content>
        <Footer /> 
      </Layout>
      <ModalContainer />
    </Layout>
  );
}
