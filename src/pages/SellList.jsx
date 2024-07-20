import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SellList = () => {
  const [myItems, setMyItems] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchItems = async () => {
    const res = await fetch(`/api/user/items/${currentUser._id}`);
    try {
      const data = await res.json();
      setMyItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/item/delete/${id}`, { method: "DELETE" });
    } catch (error) {
      console.log(error.message);
    }
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Your Items On The Market</h2>
        <div className="flex flex-wrap items-center justify-center flex-grow w-full max-w-5xl gap-3 p-3 select-none">
          {myItems &&
            myItems?.length > 0 &&
            myItems.map((item) => (
              <div
                className="flex flex-col justify-center w-48 gap-4 p-2 overflow-hidden transition-all border-2 border-black rounded-lg group/item hover:scale-105 h-fit"
                key={item._id}
              >
                <img
                  className="object-contain w-40 h-32"
                  src={item.imageUrl}
                  alt=""
                />
                <p className="truncate">Name : {item.name}</p>
                <p>
                  Price : $
                  <span className="font-semibold">{item.sellPrice}</span>
                </p>
                <p>Category : {item.category}</p>
                <div className="flex justify-between w-full">
                  <p
                    onClick={() => {
                      navigate(`/item/${item._id}`);
                    }}
                    className="text-amber-600 hover:underline "
                  >
                    View
                  </p>
                  <p
                    onClick={() => {
                      navigate(`/edit-item/${item._id}`);
                    }}
                    className="text-emerald-600 hover:underline "
                  >
                    Edit
                  </p>
                  <p
                    onClick={() => {
                      handleDelete(item._id);
                    }}
                    className="text-red-600 hover:underline "
                  >
                    Delete
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default SellList;
