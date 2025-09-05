import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./pages/main/Main";
import Mypage from "./pages/mypage/Mypage";
import Trip from "./pages/trip/Trip";
import Card from "./pages/card/Card";
import Login from "./pages/login/Login";

function AppLayout() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/mypage") || location.pathname === "/login";

  return (
    <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/trip" element={<Trip />} />
          <Route path="/card" element={<Card />} />
        </Routes>
        {!hideFooter && <Footer />}
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
