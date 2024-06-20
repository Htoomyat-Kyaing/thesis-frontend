import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  signOutStart,
  signOutSuccess,
  signOutFail,
  updateStart,
  updateSuccess,
  updateFail,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/app.js";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imageUploadError, setImageUploadError] = useState();
  const [imageUploadProgress, setImageUploadProgress] = useState(undefined);
  const [image, setImage] = useState();
  const [imageName, setImageName] = useState();
  const fileRef = useRef();
  const [success, setSuccess] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: currentUser?.username,
    email: currentUser?.email,
    password: currentUser?.password, // this is undefined, server response does not contain password
    avatar: currentUser?.avatar,
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    const res = await fetch(
      // `${import.meta.env.VITE_BASE_URL}/user/update/${currentUser._id}`,
      `/api/user/update/${currentUser._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    try {
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFail(data.message));
        setSuccess(null);
        return;
      }
      console.log(data);
      dispatch(updateSuccess(data));
      setImageUploadProgress(undefined);
      setSuccess("User updated successfully");
      fileRef.current.value = "";
    } catch (error) {
      dispatch(updateFail(error.message));
      setSuccess(null);
    }
  };
  const handleSignout = async () => {
    dispatch(signOutStart());
    // const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/sign-out`);
    const res = await fetch(`/api/auth/sign-out`);
    try {
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFail(data.message));
        return;
      }
      dispatch(signOutSuccess());

      navigate("/");
    } catch (error) {
      dispatch(signOutFail(error.message));
    }
  };
  const handleImageUpload = () => {
    console.log("Image Upload");
    const storage = getStorage(app);
    const imageName = new Date().getTime() + image.name;
    setImageName(imageName);
    const storageRef = ref(storage, imageName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Uploading : " + Math.round(progress) + " %");
        setImageUploadProgress(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setImageUploadError("Must be an image less than 2MB");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleImageDelete = () => {
    const storage = getStorage(app);
    const imageRef = ref(storage, imageName);
    deleteObject(imageRef)
      .then(async () => {
        console.log(imageRef + " has been deleted");
        setImage(undefined);
        setImageName(undefined);
        setImageUploadProgress(undefined);
        setFormData({ ...formData, avatar: currentUser?.avatar });
        // setLoading(false);
        // try {
        //   const res = await fetch(`/api/item/${params.itemId}`);
        //   const data = await res.json();
        //   setFormData(data);
        // } catch (error) {
        //   console.log(error.message);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {}, [location.key]);

  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  return currentUser ? (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Profile</h2>

        <span className="text-center text-red-600">{error && error}</span>
        <span className="text-center text-emerald-600">
          {success && success}
        </span>
        {imageUploadError ? (
          <span className="text-center text-red-600">{imageUploadError}</span>
        ) : imageUploadProgress > 0 && imageUploadProgress < 100 ? (
          <span className="text-center text-emerald-600">
            Uploading : {imageUploadProgress} %
          </span>
        ) : imageUploadProgress === 100 ? (
          <span className="text-center text-emerald-600">
            Image uploaded successfully
          </span>
        ) : (
          ""
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-sm gap-4 sm:max-w-md"
        >
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="avatar">Profile Picture</label>
            <input
              className="sr-only"
              type="file"
              ref={fileRef}
              accept="image/"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            {formData?.avatar ? (
              <div className="flex gap-4">
                <img
                  className="w-20 h-full"
                  src={formData?.avatar}
                  alt="item_picture.jpg"
                  name="item_picture"
                />
                <button
                  className="text-green-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    fileRef?.current.click();
                    setSuccess(null);
                  }}
                >
                  Edit
                </button>

                {fileRef?.current?.value ? (
                  <button
                    className="text-red-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleImageDelete();
                      setSuccess(null);
                      fileRef.current.value = ""; // NEED TO RESET FILEREF VALUE TO REUPLOAD SAME PICTURE
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <a
                className="hover:underline"
                onClick={() => {
                  fileRef?.current.click();
                }}
              >
                Upload Image
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              // required
              className="p-2 border-2 rounded-lg"
              placeholder="Username"
              onChange={handleChange}
              defaultValue={formData.username}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              // required
              name="email"
              className="p-2 border-2 rounded-lg"
              placeholder="Email"
              onChange={handleChange}
              defaultValue={formData.email}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              // required
              name="password"
              className="p-2 border-2 rounded-lg"
              placeholder="Password"
              onChange={handleChange}
              // defaultValue={formData.password}
              autoComplete="off"
            />
          </div>
          <button
            disabled={loading}
            className="w-full p-2 font-semibold uppercase rounded-lg bg-emerald-700 text-slate-100 hover:bg-emerald-600 disabled:bg-gray-700"
            type="submit"
          >
            {loading ? "Loading..." : "Update account info"}
          </button>
          <button
            disabled={loading}
            className="w-full p-2 font-semibold uppercase rounded-lg bg-sky-700 text-slate-100 hover:bg-sky-600 disabled:bg-gray-700"
            onClick={handleSignout}
          >
            {loading ? "Loading..." : "Log out the account"}
          </button>
        </form>
      </div>
    </main>
  ) : (
    <div className="flex items-center justify-center max-w-5xl mx-auto ">
      You need to sign in to see your profile
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

export default Profile;
