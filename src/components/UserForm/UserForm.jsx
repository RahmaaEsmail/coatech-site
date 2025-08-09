import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { handleCheckEmail } from "../../features/authSlice";
import { Modal } from "antd";
import { handleCreateQuote } from "../../features/quotationsSlice";

export default function UserForm({
  activeStep,
  setActiveStep,
  open,
  setOpen,
  handleSubmitSummary,
}) {
  const userData =
    JSON.parse(localStorage?.getItem("COATECH_USER_DATA")) || null;
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state?.auth);
  const [userExist, setUserExist] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    user_name: "",
    company_name: "",
    notes: "",
    address: "",
    city: "",
    region: "",
  });

  const handleEmailBlur = async () => {
    if (!formData.email) return;

    try {
      const res = await dispatch(
        handleCheckEmail({ body: { email: formData.email } })
      ).unwrap();
      if (res?.message === "Found") {
        setUserExist(true);
        setFormData({
          email: res?.data?.user_email,
          password: "",
          phone: res?.data?.phone,
          user_name: res?.data?.user_name,
          company_name: userData?.company_name || "",
          notes: userData?.notes || "",
          address: res?.data?.address,
          city: userData?.city || "",
          region: userData?.region || "",
        });
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

    if (userExist === false) {
      const requiredFields = {
        email: "Email",
        phone: "Phone",
        user_name: "User Name",
        company_name: "Company Name",
        address: "Address",
        city: "City",
        region: "Country",
        password: "Password",
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field]) {
          toast.warn(`Please fill in ${label} field`);
          return;
        }
      }
    }

    localStorage.setItem("COATECH_USER_DATA", JSON.stringify(formData));

    const selectedBanels =
      JSON.parse(localStorage.getItem("COATECH_CART_ITEMS")) || [];
    const data_send = {
      ...formData,
      ...(selectedBanels?.length > 0 && {
        product_ids: selectedBanels.map((item) => ({
          id: item?.id,
          quantity: item?.formData?.quantity,
          type: item?.formData?.type,
          props: JSON.stringify(item),
        })),
      }),
    };

    dispatch(handleCreateQuote({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.message === "Quote created successfully") {
          toast.success(res?.message);
          localStorage.removeItem("COATECH_CART_ITEMS");
          localStorage.removeItem("COATECH_USER_DATA");
          setActiveStep(0);
          setOpen(false);
          setFormData({
            email: "",
            password: "",
            phone: "",
            user_name: "",
            company_name: "",
            notes: "",
            address: "",
            city: "",
            region: "",
          });
        } else {
          toast.error(res?.message || "Submission failed");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("An error occurred while submitting the quote.");
      });
  }

  useEffect(() => {
    localStorage.setItem("COATECH_USER_DATA", JSON.stringify(formData));
  }, [formData]);

  return (
    <div className="my-6">
      <Modal
        footer={null}
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        className="flex ms-auto w-fit items-center gap-2"
      >
        <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label>
              Name {userExist === false && <span className="text-red-600">*</span>}
            </label>
            <input
              required={userExist === false}
              value={formData.user_name}
              onChange={(e) =>
                setFormData({ ...formData, user_name: e.target.value })
              }
              type="text"
            />
          </div>

          <div className="input-group">
            <label>
              Email {userExist === false && <span className="text-red-600">*</span>}
            </label>
            <input
              required={userExist === false}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onBlur={handleEmailBlur}
              type="email"
            />
          </div>

          <div className="input-group">
            <label>
              Phone {userExist === false && <span className="text-red-600">*</span>}
            </label>
            <PhoneInput
              required={userExist === false}
              defaultCountry="EG"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              className="!w-full rounded-md border focus:!border-red-500 border-[#c8c7c7] px-2"
            />
          </div>

          {userExist === false && (
            <div className="input-group">
              <label>
                Password<span className="text-red-600">*</span>
              </label>
              <input
                required
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
              Company Name {userExist === false && <span className="text-red-600">*</span>}
            </label>
            <input
              required={userExist === false}
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              type="text"
            />
          </div>

          <div className="input-group md:col-span-2">
            <label>
              Address {userExist === false && <span className="text-red-600">*</span>}
            </label>
            <input
              required={userExist === false}
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              type="text"
            />
          </div>

          <div className="input-group">
            <label>
              City {userExist === false && <span className="text-red-600">*</span>}
            </label>
            <input
              required={userExist === false}
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              type="text"
            />
          </div>

          <div className="input-group">
            <label>
              Country {userExist === false && <span className="text-red-600">*</span>}
            </label>
            <input
              required={userExist === false}
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
      </Modal>
    </div>
  );
}
