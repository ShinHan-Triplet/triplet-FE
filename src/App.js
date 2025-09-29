import {
  Outlet,
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./pages/main/Main";
import Mypage from "./pages/mypage/Mypage";
import MyCardDetail from "./pages/mypage/MyCardDetail";
import MyCardHistory from "./pages/mypage/MyCardHistory";
import MyTripDetail from "./pages/mypage/MyTripDetail";
import MyTripReport from "./pages/mypage/MyTripReport";
import MyTripHistory from "./pages/mypage/MyTripHistory";
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
import MyTripEdit from "./pages/mypage/MyTripEdit";
import Error from "./pages/error/Error";

function AppLayout() {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/mypage") || location.pathname === "/login";
  const hideHeader = location.pathname === "/login";

  return (
    <div className="App">
      {!hideHeader && <Header />}
      <Outlet />
      {!hideFooter && <Footer />}
    </div>
  );

  // return (
  //   <div className="App">
  //     {!hideHeader && <Header />}
  //     <Routes>
  //       <Route path="/" element={<Main />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/auth/callback" element={<LoginCheck />} />
  //       <Route
  //         path="/mypage"
  //         element={
  //           <RequireAuth>
  //             <Mypage />
  //           </RequireAuth>
  //         }
  //       />
  //       <Route path="/mypage/card/:id" element={<MyCardDetail />} />
  //       <Route path="/mypage/card/:id/history" element={<MyCardHistory />} />
  //       <Route path="/mypage/trip/:id" element={<MyTripDetail />} />
  //       <Route path="/mypage/trip/:id/report" element={<MyTripReport />} />
  //       <Route path="/mypage/trip/:id/edit" element={<MyTripEdit />} />
  //       <Route path="/mypage/trip/:id/history" element={<MyTripHistory />} />
  //       <Route path="/trip" element={<Trip />} />
  //       <Route
  //         path="/trip/new/details"
  //         element={
  //           <RequireAuth>
  //             <NewTrip />
  //           </RequireAuth>
  //         }
  //       />
  //       <Route
  //         path="/trip/new/cost"
  //         element={
  //           <RequireAuth>
  //             <TripCost />
  //           </RequireAuth>
  //         }
  //       />
  //       <Route
  //         path="/trip/new/companions"
  //         element={
  //           <RequireAuth>
  //             <Gather />
  //           </RequireAuth>
  //         }
  //       />
  //       <Route
  //         path="/trip/new/gather"
  //         element={
  //           <RequireAuth>
  //             <NewGather />
  //           </RequireAuth>
  //         }
  //       />
  //       <Route
  //         path="/trip/new/card"
  //         element={
  //           <RequireAuth>
  //             <TripCard />
  //           </RequireAuth>
  //         }
  //       />
  //       <Route path="/card" element={<Card />} />
  //       <Route
  //         path="/card/:id/apply"
  //         element={
  //           <RequireAuth>
  //             <NewCard />
  //           </RequireAuth>
  //         }
  //       />
  //       {/* <Route path="*" element={<Error />} /> */}
  //     </Routes>
  //     {!hideFooter && <Footer />}
  //   </div>
  // );
}

function App() {
  // return (
  //   <BrowserRouter>
  //     <ScrollToTop />
  //     <Routes>
  //       <Route path="/*" element={<AppLayout />} />
  //       <Route path="*" element={<Error />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
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
          <Route
            path="/mypage/card/:id"
            element={
              <RequireAuth>
                <MyCardDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/mypage/card/:id/history"
            element={
              <RequireAuth>
                <MyCardHistory />
              </RequireAuth>
            }
          />
          <Route
            path="/mypage/trip/:id"
            element={
              <RequireAuth>
                <MyTripDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/mypage/trip/:id/report"
            element={
              <RequireAuth>
                <MyTripReport />
              </RequireAuth>
            }
          />
          <Route
            path="/mypage/trip/:id/edit"
            element={
              <RequireAuth>
                <MyTripEdit />
              </RequireAuth>
            }
          />
          <Route
            path="/mypage/trip/:id/history"
            element={
              <RequireAuth>
                <MyTripHistory />
              </RequireAuth>
            }
          />
          <Route path="/trip" element={<Trip />} />
          <Route
            path="/trip/new/details"
            element={
              <RequireAuth>
                <NewTrip />
              </RequireAuth>
            }
          />
          <Route
            path="/trip/new/cost"
            element={
              <RequireAuth>
                <TripCost />
              </RequireAuth>
            }
          />
          <Route
            path="/trip/new/companions"
            element={
              <RequireAuth>
                <Gather />
              </RequireAuth>
            }
          />
          <Route
            path="/trip/new/gather"
            element={
              <RequireAuth>
                <NewGather />
              </RequireAuth>
            }
          />
          <Route
            path="/trip/new/card"
            element={
              <RequireAuth>
                <TripCard />
              </RequireAuth>
            }
          />
          <Route path="/card" element={<Card />} />
          <Route
            path="/card/:id/apply"
            element={
              <RequireAuth>
                <NewCard />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
