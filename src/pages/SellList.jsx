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
      // console.log(id);
    } catch (error) {
      console.log(error.message);
    }
    fetchItems();
    console.log("items refetched");
  };
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    console.log(myItems);
  }, [myItems]);
  return (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Your Items On The Market</h2>
        <div className="flex flex-wrap justify-center w-full gap-6 hover:cursor-pointer">
          {myItems &&
            myItems.length > 0 &&
            myItems.map((item) => (
              <div
                className="flex flex-col items-center justify-center max-w-sm p-2 border-2 border-black rounded-lg w-fit"
                key={item._id}
              >
                <img
                  className="object-contain w-40 h-32"
                  src={item.imageUrl}
                  alt=""
                  onClick={() => {
                    navigate(`/item/${item._id}`);
                  }}
                />
                <p>Name : {item.name}</p>
                <p>Price : {item.sellPrice} Kyats</p>
                <p>Category : {item.category}</p>

                <div className="flex justify-between w-full">
                  <p
                    onClick={() => {
                      navigate(`/edit-item/${item._id}`);
                    }}
                    className="text-emerald-600 hover:underline hover:cursor-pointer"
                  >
                    Edit
                  </p>
                  <p
                    onClick={() => {
                      handleDelete(item._id);
                    }}
                    className="text-red-600 hover:underline hover:cursor-pointer"
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
