import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import PrivateRoute from "./pages/PrivateRoute";
import ListItem from "./pages/ListItem";
import SellList from "./pages/SellList";
import EditItem from "./pages/EditItem";
import ItemPage from "./pages/ItemPage";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/item/:itemId" element={<ItemPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/list-item" element={<ListItem />} />
          <Route path="/your-items" element={<SellList />} />
          <Route path="/edit-item/:itemId" element={<EditItem />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
