import { useDispatch, useSelector } from "react-redux";
import {
  deleteWholeCart,
  addMore,
  removeFromCart,
} from "../redux/user/userSlice";
import { IoMdAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const { currentUser, cart } = useSelector((state) => state.user);
  // const found1 = cart.find((item) => item.name === formData?.name);
  // console.log(currentUser._id);
  // console.log(cart);
  const navigate = useNavigate();
  const [success, setSuccess] = useState();
  let amountArray = cart?.map((item) => parseInt(item.sellPrice * item.amount));
  let totalAmount = amountArray.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    const stripe = await loadStripe(
      "pk_test_51PdszvK4eOVHzmzkBxjSJSt2PNeaHD2HHWYevLNhoygmql2Mm2FviL9QiU1bES8McYn74HHnmLe5ZIPQMj0lewYU004siRA6Xa"
    );

    const res = await fetch("/api/checkout/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    const session = await res.json();
    console.log(session.id);
    const result = stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      console.log(result.error);
    }
  };

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
        setSuccess(null);
        return;
      }
      console.log(data);
      // dispatch(updateSuccess(data));
      // setImageUploadProgress(undefined);
      setSuccess("Cart has been saved");
      // fileRef.current.value = "";
    } catch (error) {
      // dispatch(updateFail(error.message));
      setSuccess(null);
    }
  };

  return (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Your Cart</h2>

        <span className="text-center text-emerald-600">
          {success && success}
        </span>

        <div className="flex flex-col justify-center w-full">
          {cart &&
            cart.map((item) => (
              <div
                className="flex items-center justify-between w-full max-w-5xl gap-5 py-2 border-b-2 border-slate-900 first:border-t-2"
                key={item.id}
              >
                <div className="flex items-center justify-center flex-1 gap-5 sm:justify-start">
                  <img
                    src={item.imageUrl}
                    className="object-contain w-8 h-8 transition-all border-2 border-white rounded-lg sm:w-12 sm:h-12 hover:border-slate-800 hover:scale-125 hover:cursor-pointer"
                    onClick={() => {
                      navigate(`/item/${item.id}`);
                    }}
                  />
                  <p className="hidden sm:inline-block">{item.name}</p>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 text-sm">
                  <p className="text-base transition-all select-none sm:text-xl">
                    $
                    <span className="font-bold">
                      {item.sellPrice * item.amount}
                    </span>
                  </p>{" "}
                </div>
                <div className="flex-1">
                  <div className="flex justify-center gap-2 sm:gap-5 group/item">
                    <button
                      disabled={item.amount === item.inStock}
                      className="transition-all disabled:text-gray-600 disabled:opacity-75 text-emerald-600 hover:scale-125"
                      onClick={() => {
                        dispatch(addMore(item.name));
                      }}
                    >
                      <IoMdAddCircle />
                    </button>
                    <span className="text-base font-bold transition-all duration-200 select-none sm:text-xl group-active/item:scale-150">
                      {item.amount}
                    </span>

                    <button
                      disabled={item.amount === 0}
                      className="text-red-600 transition-all disabled:text-gray-600 disabled:opacity-75 hover:scale-125"
                      onClick={() => {
                        dispatch(removeFromCart(item.name));
                      }}
                    >
                      <IoIosRemoveCircle />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-wrap items-center justify-between w-full gap-5 sm:justify-end">
          <p className="flex-1 font-bold text-center sm:text-xl">Total :</p>
          <div className="flex items-center justify-center flex-1 w-full gap-2 text-sm sm:w-fit">
            <p className="text-base transition-all select-none sm:text-xl">
              $<span className="font-bold">{totalAmount}</span>
            </p>
          </div>

          <div className="flex items-center justify-center w-full gap-2 sm:gap-5 sm:w-fit">
            <button
              // disabled={cart?.length === 0}
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
              disabled={cart?.length === 0}
              className="self-center px-2 py-1 font-bold capitalize border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
              onClick={() => {
                dispatch(deleteWholeCart());
              }}
            >
              Delete Cart
            </button>

            <button
              disabled={cart?.length === 0}
              className="self-center px-2 py-1 font-bold capitalize border-2 border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
              onClick={() => {
                handleCheckout();
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
