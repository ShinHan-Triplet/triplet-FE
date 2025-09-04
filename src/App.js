import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./pages/main/Main";
import Mypage from "./pages/mypage/Mypage";
import Trip from "./pages/trip/Trip";
import Card from "./pages/card/Card";
import Login from "./pages/login/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/trip" element={<Trip />} />
          <Route path="/card" element={<Card />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
