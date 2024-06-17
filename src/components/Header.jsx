import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="p-3 bg-red-300 select-none">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link reloadDocument to={"/"}>
          <h1 className="text-xl font-bold hover:underline">Logo</h1>
        </Link>

        <ul className="flex flex-wrap items-center gap-4">
          <li className="hover:underline">
            <Link to={"/sell-list"}>Sell List</Link>
          </li>
          <li className="hover:underline">
            <Link to={"/list-item"}>List Item</Link>
          </li>

          {currentUser?.avatar ? (
            <li className="hover:underline">
              <Link to={`/profile`}>
                <img
                  className="w-8 rounded-full hover:border-2 hover:border-slate-900"
                  src={`${currentUser.avatar}`}
                  alt="default_avatar.jpg"
                />
              </Link>
            </li>
          ) : (
            <li className="hover:underline">
              <Link to={"/sign-in"}>Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
