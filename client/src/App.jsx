import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SingIn from "./pages/SingIn";
import SingUp from "./pages/SingUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./component/Header";
import PrivateRoutes from "./component/PrivateRoutes";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/sign-in" element={<SingIn />} />
        <Route path="/sign-up" element={<SingUp />} />
        <Route path="/about" element={<About />} />

        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
