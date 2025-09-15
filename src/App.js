import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./pages/main/Main";
import Mypage from "./pages/mypage/Mypage";
import MyCardDetail from "./pages/mypage/MyCardDetail";
import MyCardHistory from "./pages/mypage/MyCardHistory";
import MyTripDetail from "./pages/mypage/MyTripDetail";
import NewTrip from "./pages/trip/NewTrip";
import Login from "./pages/login/Login";
import LoginCheck from "./pages/login/LoginCheck";
import TripCost from "./pages/trip/TripCost";
import Trip from "./pages/trip/Trip";
import Gather from "./pages/trip/Gather";
import NewGather from "./pages/trip/NewGather";
import TripCard from "./pages/trip/TripCard";
import ScrollToTop from "./components/util/ScrollToTop";
import Card from "./pages/card/Card";
import NewCard from "./pages/card/NewCard";
import RequireAuth from "./auth/RequireAuth";

function AppLayout() {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/mypage") || location.pathname === "/login";
  const hideHeader = location.pathname === "/login";

  return (
    <div className="App">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<LoginCheck />} />
        <Route
          path="/mypage"
          element={
            <RequireAuth>
              <Mypage />
            </RequireAuth>
          }
        />
        <Route path="/mypage/card/:id" element={<MyCardDetail />} />
        <Route path="/mypage/card/:id/history" element={<MyCardHistory />} />
        <Route path="/mypage/trip/:id" element={<MyTripDetail />} />
        <Route path="/trip" element={<Trip />} />
        <Route path="/trip/new/details" element={<NewTrip />} />
        <Route path="/trip/new/cost" element={<TripCost />} />
        <Route path="/trip/new/companions" element={<Gather />} />
        <Route path="/trip/new/gather" element={<NewGather />} />
        <Route path="/trip/new/card" element={<TripCard />} />
        <Route path="/card" element={<Card />} />
        <Route path="/card/:id/apply" element={<NewCard />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
