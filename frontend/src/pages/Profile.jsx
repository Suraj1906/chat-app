import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Profile = ({ user, serverUrl }) => {
  const [name, setName] = useState(user?.name || "");
  const [backendImage, setBackendImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.image || "");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const token = localStorage.getItem("token"); // ✅ get token from localStorage

      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token, // ✅ send JWT token to backend
        },
        withCredentials: true,
      });

      dispatch(setUserData(result.data));
      setSaving(false);
      navigate("/");
    } catch (error) {
      console.log("Profile update error:", error);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

      <form onSubmit={handleProfile} className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={previewImage || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 rounded-lg text-white ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
