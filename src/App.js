import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./pages/main/Main";
import Mypage from "./pages/mypage/Mypage";
import MyCardDetail from "./pages/mypage/MyCardDetail";
import MyCardHistory from "./pages/mypage/MyCardHistory";
import MyTripDetail from "./pages/mypage/MyTripDetail";
import Trip from "./pages/trip/Trip";
import Card from "./pages/card/Card";
import Login from "./pages/login/Login";
import TripCost from "./pages/trip/TripCost";

function AppLayout() {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/mypage") || location.pathname === "/login";

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/trip" element={<Trip />} />
        <Route path="/tripcost" element={<TripCost />} />
        <Route path="/card" element={<Card />} />
        <Route path="/mypage/card/:id" element={<MyCardDetail />} />
        <Route path="/mypage/card/:id/history" element={<MyCardHistory />} />
        <Route path="/mypage/trip/:id" element={<MyTripDetail />} />
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
