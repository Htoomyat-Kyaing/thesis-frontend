import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Profile = lazy(() => import("./pages/Profile"));
const PrivateRoute = lazy(() => import("./pages/PrivateRoute"));
const ItemPage = lazy(() => import("./pages/ItemPage"));
const ListItem = lazy(() => import("./pages/ListItem"));
const SellList = lazy(() => import("./pages/SellList"));
const EditItem = lazy(() => import("./pages/EditItem"));
const Cart = lazy(() => import("./pages/Cart"));
const Admin = lazy(() => import("./pages/Admin"));
const ManageUsers = lazy(() => import("./pages/ManageUsers"));
const ManageItems = lazy(() => import("./pages/ManageItems"));
const UserDetailsForAdmin = lazy(() => import("./pages/UserDetailsForAdmin"));
const EditUserByAdmin = lazy(() => import("./pages/EditUserByAdmin"));
const EditItemForAdmin = lazy(() => import("./pages/EditItemForAdmin"));
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/items" element={<ManageItems />} />
            <Route
              path="/admin/edit-item/:itemId"
              element={<EditItemForAdmin />}
            />
            <Route
              path="/admin/user-details/:userId"
              element={<UserDetailsForAdmin />}
            />
            <Route
              path="/admin/edit-user/:userId"
              element={<EditUserByAdmin />}
            />
          </Route>
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
      </Suspense>
    </BrowserRouter>
  );
}
