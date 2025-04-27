import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { handleCheckEmail } from "../../features/authSlice";

export default function UserForm({ activeStep, setActiveStep }) {
  const userData =
    JSON.parse(localStorage?.getItem("COATECH_USER_DATA")) || null;
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state?.auth);
  const [userExist, setUserExist] = useState(null);
  const [formData, setFormData] = useState({
    email: userData?.email,
    password: "",
    phone: userData?.phone,
    user_name: userData?.user_name,
    company_name: userData?.company_name,
    notes: userData?.notes,
    address: userData?.address,
    city: userData?.city,
    region: userData?.region,
  });

  const handleEmailBlur = async () => {
    if (!formData.email) return;

    try {
      const res = await dispatch(
        handleCheckEmail({ body: { email: formData.email } })
      ).unwrap();
      if (res?.message === "Found") {
        setUserExist(true);
      } else {
        setUserExist(false);
      }
    } catch (err) {
      toast.error("Error checking email");
      setUserExist(null);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email) {
      toast.warn("Please fill in  email field");
      return;
    }

    localStorage.setItem("COATECH_USER_DATA", JSON.stringify(formData));
    // toast.success("Account Created Successfully");
    setActiveStep((prev) => prev + 1);
  }

  return (
    <div className="my-6">
      <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label>
            User Name<span className="text-red-600"></span>
          </label>
          <input
            value={formData.user_name}
            onChange={(e) =>
              setFormData({ ...formData, user_name: e.target.value })
            }
            type="text"
          />
        </div>

        <div className="input-group">
          <label>
            Email<span className="text-red-600">*</span>
          </label>
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onBlur={handleEmailBlur}
            type="email"
          />
        </div>

        {userExist === false && (
          <div className="input-group">
            <label>
              Password<span className="text-red-600">*</span>
            </label>
            <input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
            />
          </div>
        )}

        <div className="input-group">
          <label>
            Phone<span className="text-red-600">*</span>
          </label>
          <PhoneInput
            defaultCountry="EG"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            className="!w-full rounded-md border focus:!border-red-500 border-[#c8c7c7] px-2"
          />
        </div>

        <div className="input-group">
          <label>
            Company Name<span className="text-red-600">*</span>
          </label>
          <input
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            type="text"
          />
        </div>

        <div className="input-group md:col-span-2">
          <label>Address</label>
          <input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            type="text"
          />
        </div>

        <div className="input-group">
          <label>City</label>
          <input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            type="text"
          />
        </div>

        <div className="input-group">
          <label>Country</label>
          <input
            value={formData.region}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value })
            }
            type="text"
          />
        </div>

        <div className="input-group md:col-span-2">
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="h-[100px]"
          />
        </div>
      </div>

      <div className="col-span-2 flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className="bg-(--main-red-color) text-white p-2 rounded-md w-full md:w-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
}
