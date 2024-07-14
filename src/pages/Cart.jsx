import { useDispatch, useSelector } from "react-redux";
import {
  deleteWholeCart,
  addMore,
  removeFromCart,
} from "../redux/user/userSlice";
import { IoMdAddCircle, IoIosRemoveCircle } from "react-icons/io";

const Cart = () => {
  const { currentUser, cart } = useSelector((state) => state.user);
  // const found1 = cart.find((item) => item.name === formData?.name);
  // console.log(currentUser._id);
  // console.log(cart);

  const handleSaveCart = async (e) => {
    e.preventDefault();
    // dispatch(updateStart());
    const res = await fetch(
      // `${import.meta.env.VITE_BASE_URL}/user/update/${currentUser._id}`,
      `/api/user/update-cart/${currentUser._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      }
    );
    try {
      const data = await res.json();
      if (data.success === false) {
        // dispatch(updateFail(data.message));
        // setSuccess(null);
        return;
      }
      console.log(data);
      // dispatch(updateSuccess(data));
      // setImageUploadProgress(undefined);
      // setSuccess("User updated successfully");
      // fileRef.current.value = "";
    } catch (error) {
      // dispatch(updateFail(error.message));
      // setSuccess(null);
    }
  };

  const dispatch = useDispatch();
  return (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Your Cart</h2>

        <div className="flex flex-col justify-center w-full">
          {cart &&
            cart.map((item) => (
              <div
                className="flex items-center justify-between w-full max-w-5xl gap-5"
                key={item.id}
              >
                <img
                  src={item.imageUrl}
                  className="object-contain w-8 h-8 rounded-full"
                />
                <p>{item.name}</p>
                <p className="flex items-center gap-2">
                  <span className="text-xl font-bold transition-all select-none">
                    {item.sellPrice * item.amount}
                  </span>{" "}
                  Kyats
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    disabled={item.amount === item.inStock}
                    className="capitalize disabled:text-red-600"
                    onClick={() => {
                      dispatch(addMore(item.name));
                    }}
                  >
                    <IoMdAddCircle />
                  </button>
                  <span className="text-xl font-bold transition-all select-none">
                    {item.amount}
                  </span>

                  <button
                    disabled={item.amount === 0}
                    className="capitalize disabled:text-red-600"
                    onClick={() => {
                      dispatch(removeFromCart(item.name));
                    }}
                  >
                    <IoIosRemoveCircle />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-between gap-5">
          {/* <button
            disabled={
              formData.inStock === 0 || formData?.inStock === found1?.amount
            }
            className="capitalize disabled:text-red-600"
            onClick={() => {
              if (found1 === undefined) {
                dispatch(
                  addToCart({
                    id: formData?._id,
                    imageUrl: formData?.imageUrl,
                    name: formData?.name,
                    amount: 1,
                  })
                );
              } else {
                dispatch(addMore(found1?.name));
              }
            }}
          >
            add item to cart
          </button>
          <button
            disabled={
              formData.inStock === 0 ||
              found1?.amount === undefined ||
              cart.length === 0
            }
            className="capitalize disabled:text-red-600"
            onClick={() => {
              dispatch(removeFromCart(found1.name));
            }}
          >
            remove from cart
          </button> */}

          <button
            // disabled={cart.length === 0}
            className="self-center px-2 py-1 font-bold capitalize border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
            onClick={(e) => {
              // dispatch(deleteWholeCart());
              // console.log(cart);
              handleSaveCart(e);
            }}
          >
            Save cart
          </button>
          <button
            disabled={cart.length === 0}
            className="self-center px-2 py-1 font-bold capitalize border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
            onClick={() => {
              dispatch(deleteWholeCart());
            }}
          >
            Delete Cart
          </button>
        </div>
      </div>
    </main>
  );
};

export default Cart;
