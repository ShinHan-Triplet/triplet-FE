import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<div>메인 페이지</div>} />
          <Route path="/login" element={<div>로그인 페이지</div>} />
          <Route path="/mypage" element={<div>마이페이지</div>} />
          <Route path="/trip" element={<div>여행 예산 페이지</div>} />
          <Route path="/card" element={<div>카드 발급 페이지</div>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
