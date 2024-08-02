import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCartArrowDown, FaStore, FaUserCog } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { BiSitemap } from "react-icons/bi";

const Header = () => {
  const { currentUser, cart } = useSelector((state) => state.user);
  return (
    <header className="p-3 bg-red-300 select-none">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link reloadDocument to={"/"}>
          <h1 className="text-xl font-bold hover:underline">thesis-project</h1>
        </Link>

        <ul className="flex flex-wrap items-center gap-4">
          {currentUser?.role === "user" && (
            <>
              <li className="flex items-center justify-center w-fit">
                <Link
                  className="transition-all rounded-full sm:hidden hover:scale-150"
                  to={"/your-items"}
                >
                  <FaStore size={20} />
                </Link>
                <Link
                  className="hidden gap-1 transition-all hover:border-b hover:border-black sm:flex sm:items-center hover:-translate-y-0.5"
                  to={"/your-items"}
                >
                  <FaStore size={14} />
                  <span>Your Items</span>
                </Link>
              </li>
              <li className="flex items-center justify-center w-fit">
                <Link
                  className="transition-all rounded-full sm:hidden hover:scale-150"
                  to={"/list-item"}
                >
                  <MdSell size={20} />
                </Link>
                <Link
                  className="hidden gap-1 transition-all hover:border-b hover:border-black sm:flex sm:items-center hover:-translate-y-0.5"
                  to={"/list-item"}
                >
                  <MdSell size={14} />
                  <span>List Item</span>
                </Link>
              </li>
              <li className="flex items-center justify-center w-fit">
                <Link
                  className="relative transition-all rounded-full sm:hidden hover:scale-150"
                  to={"/cart"}
                >
                  {cart?.length !== 0 && (
                    <span className="absolute flex w-4 h-4 -top-1.5 -right-2 ">
                      <span className="absolute inline-flex w-full h-full bg-purple-400 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative flex items-center justify-center w-4 h-4 bg-purple-500 rounded-full">
                        <p className="text-xs font-bold text-white">
                          {cart?.length}
                        </p>
                      </span>
                    </span>
                  )}
                  <FaCartArrowDown size={20} />
                </Link>
                <Link
                  className="hidden gap-1 transition-all hover:border-b hover:border-black sm:flex sm:items-center hover:-translate-y-0.5 relative"
                  to={"/cart"}
                >
                  <FaCartArrowDown size={14} />
                  {cart?.length !== 0 && (
                    <span className="absolute flex w-4 h-4 -top-1.5 right-0 ">
                      <span className="absolute inline-flex w-full h-full bg-purple-400 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative flex items-center justify-center w-4 h-4 bg-purple-500 rounded-full">
                        <p className="text-xs font-bold text-white">
                          {cart?.length}
                        </p>
                      </span>
                    </span>
                  )}
                  <span>Your Cart</span>
                </Link>
              </li>
            </>
          )}

          {currentUser?.role === "admin" && (
            <>
              <li className="flex items-center justify-center w-fit">
                <Link
                  className="transition-all rounded-full sm:hidden hover:scale-150"
                  to={"/admin/users"}
                >
                  <FaUserCog size={20} />
                </Link>
                <Link
                  className="hidden gap-1 transition-all hover:border-b hover:border-black sm:flex sm:items-center hover:-translate-y-0.5"
                  to={"/admin/users"}
                >
                  <FaUserCog size={14} />
                  <span>Manage Users</span>
                </Link>
              </li>

              <li className="flex items-center justify-center w-fit">
                <Link
                  className="transition-all rounded-full sm:hidden hover:scale-150"
                  to={"/admin/items"}
                >
                  <BiSitemap size={20} />
                </Link>
                <Link
                  className="hidden gap-1 transition-all hover:border-b hover:border-black sm:flex sm:items-center hover:-translate-y-0.5"
                  to={"/admin/items"}
                >
                  <BiSitemap size={14} />
                  <span>Manage Items</span>
                </Link>
              </li>
            </>
          )}

          {currentUser !== null || undefined ? (
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
