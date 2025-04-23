import React, { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';


export default function UserForm({ activeStep, setActiveStep }) {
  const userData =
  JSON.parse(localStorage?.getItem("COATECH_USER_DATA")) || null;

  const [formData, setFormData] = useState({
    email: userData?.email,
    password: userData?.password,
    phone: userData?.phone,
    company_name: userData?.company_name,
    notes: userData?.notes,
    address: userData?.address,
    city: userData?.city,
    region: userData?.region,
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warn("Please fill in all required fields");
      return;
    }

    if (userData?.email === formData?.email) {
      toast.success("Your Email Already Exists, Login Successful");
      return;
    }

    localStorage.setItem("COATECH_USER_DATA", JSON.stringify(formData));
    toast.success("Account Created Successfully");

    setFormData({
      email: "",
      password: "",
      phone: "",
      company_name: "",
      notes: "",
      address: "",
      city: "",
      region: "",
    });
  }

  return (
    <div className="my-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-900">
          User Info <span className="text-[#E82F3C]">*</span>:
        </h3>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50"
            onClick={() => setActiveStep((prev) => prev - 1)}
            disabled={activeStep === 0}
          >
            <FaAnglesLeft />
          </button>

          <button
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50"
            onClick={() => setActiveStep((prev) => prev + 1)}
            disabled={activeStep === 3}
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-5 grid grid-cols-2 gap-4">
        <div className="input-group">
          <label>
            Email<span className="text-red-600">*</span>
          </label>
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            type="email"
          />
        </div>

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

        <div className="input-group phone-input">
          <label>Phone<span className="text-red-600">*</span></label>
          <PhoneInput
            defaultCountry="EG"
            value={formData.phone}
            onChange={(value) =>
              setFormData({ ...formData, phone: value })
            }
            className="!w-full rounded-md border focus:!border-red-500 border-[#c8c7c7] px-2"
          />
        </div>

        <div className="input-group">
          <label>Company Name<span className="text-red-600">*</span></label>
          <input
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            type="text"
          />
        </div>

        <div className="input-group col-span-2">
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
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            type="text"
          />
        </div>

        <div className="input-group">
          <label>Region</label>
          <input
            value={formData.region}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value })
            }
            type="text"
          />
        </div>

        <div className="input-group col-span-2">
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>
      </form>

      <div className="col-span-2">
          <button
          onClick={() => {
            localStorage.setItem("COATECH_USER_DATA", JSON.stringify(formData));
            setActiveStep((prev) => prev + 1)
          }}
            className="mt-4 bg-(--main-red-color) text-white p-2 rounded-md"
          >
            Next
          </button>
        </div>
    </div>
  );
}
