import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="p-3 bg-red-300 select-none">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link reloadDocument to={"/"}>
          <h1 className="text-xl font-bold hover:underline">thesis-project</h1>
        </Link>

        <ul className="flex flex-wrap items-center gap-4">
          <li className="hover:underline">
            <Link to={"/sell-list"}>Sell List</Link>
          </li>
          <li className="hover:underline">
            <Link to={"/list-item"}>List Item</Link>
          </li>

          {currentUser?.avatar ? (
            <li className="flex items-center justify-center w-10 h-10 rounded-full hover:underline">
              <Link to={`/profile`}>
                <img
                  className="object-cover w-10 h-10 border-2 border-red-300 rounded-full hover:border-emerald-300"
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
