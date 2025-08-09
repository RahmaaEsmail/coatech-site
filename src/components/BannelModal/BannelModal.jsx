import { Modal, Switch } from "antd";
import React, { useState, useEffect } from "react";
import {
  GLOSS_LEVEL,
  RAL_FINISH,
  POWDER_TYPES,
} from "../../utils/data";
import { toast } from "react-toastify";

export default function BannelModal({ setActiveStep, open, setOpen, item }) {
  const [formData, setFormData] = useState({
    catelog_name: "",
    color: "",
    powder_type: "",
    finish: "",
    gloss_level: "",
    clear_coats: "",
    type: false, // false for kg, true for lb
    quantity: null,
    comment: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    const { quantity, type } = formData;
    const isRAL = item?.product_category === "RAL";

    // RAL-specific validations
    if (isRAL) {
      if (!formData?.gloss_level) {
        toast.warn("Please select gloss level first!");
        return;
      }

      if (!formData?.finish) {
        toast.warn("Please select finish first!");
        return;
      }

      if (!formData?.powder_type) {
        toast.warn("Please select Chemistry first!");
        return;
      }
    }

    if (+quantity <= 0) {
      toast.warn("Please enter a positive quantity");
      return;
    }

    let isValid = false;

    if (!type) {
      isValid = +quantity % 25 === 0;
    } else {
      const mod = +quantity % 55.116;
      isValid = mod < 0.01 || mod > 55.106;
    }

    if (!isValid) {
      toast.warn(
        `Please enter a quantity that is a multiple of ${
          !type ? "25" : "55.116"
        } (${!type ? "KG" : "LB"})`
      );
      return;
    }

    const banelObject = {
      id: item.product_id,
      img: item.product_image,
      color: item.color,
      type: type ? "lb" : "kg",
      formData: { ...formData },
      quantity: 1,
    };

    const existingCartItems =
      JSON.parse(localStorage.getItem("COATECH_CART_ITEMS")) || [];
    const existingItemIndex = existingCartItems.findIndex(
      (cartItem) => cartItem.id === banelObject.id
    );

    let updatedCartItems;
    if (existingItemIndex !== -1) {
      updatedCartItems = existingCartItems.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCartItems = [...existingCartItems, banelObject];
    }

    localStorage.setItem(
      "COATECH_CART_ITEMS",
      JSON.stringify(updatedCartItems)
    );

    toast.success("Your requested color has been added to your quote.");

    setFormData({
      catelog_name: "",
      color: "",
      powder_type: "",
      finish: "",
      gloss_level: "",
      clear_coats: "",
      type: false,
      quantity: "",
      comment: "",
    });

    setOpen(false);
  }

  useEffect(() => {
    console.log(item);
  }, [item]);

  return (
    <div>
      <Modal
        footer={null}
        width={"800px"}
        open={open}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
          <div className="w-fit">
            <img src={item?.product_image} className="object-cover" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {item?.product_category === "RAL" && (
              <>
                <div className="input-group">
                  <label>
                    <span>Gloss Level</span>
                  </label>
                  <select
                    value={formData.gloss_level}
                    onChange={(e) =>
                      setFormData({ ...formData, gloss_level: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Gloss Level
                    </option>
                    {GLOSS_LEVEL?.map((item) => (
                      <option key={item?.id} value={item?.name}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>
                    <span>Finish</span>
                  </label>
                  <select
                    value={formData.finish}
                    onChange={(e) =>
                      setFormData({ ...formData, finish: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Finish
                    </option>
                    {RAL_FINISH?.map((item) => (
                      <option key={item?.id} value={item?.label}>
                        {item?.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>
                    <span>Chemistry</span>
                  </label>
                  <select
                    value={formData.powder_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        powder_type: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select Chemistry
                    </option>
                    {POWDER_TYPES?.map((item) => (
                      <option key={item?.id} value={item?.value}>
                        {item?.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="input-group">
              <label>Comment</label>
              <textarea
                value={formData?.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
              ></textarea>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center">
              <div className="input-group w-full">
                <label>Weight in {formData.type ? "lb" : "kg"}:</label>
                <input
                  value={formData?.quantity || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: +e.target.value,
                    })
                  }
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  placeholder="Quantity"
                />
              </div>

              <div className="flex gap-2 items-center mt-[30px]">
                <label>Kg</label>
                <Switch
                  checked={formData.type}
                  onChange={(checked) =>
                    setFormData({ ...formData, type: checked })
                  }
                />
                <label>lb</label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-(--main-red-color) p-2 rounded-md hover:bg-[#e82f3bc1] text-white"
            >
              Add To Quote
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
