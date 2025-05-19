import { Modal, Switch } from "antd";
import React, { useEffect, useState } from "react";
import {
  ALL_COLORS,
  catalogs,
  CLEAR_COATS,
  FINISH,
  GLOSS_LEVEL,
  POWDER_TYPES,
} from "../../utils/data";
import { toast } from "react-toastify";
import UserForm from "../UserForm/UserForm";

export default function BannelModal({setActiveStep , open, setOpen, item }) {

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

  const [selectedBanels, setSelectedBanels] = useState(
    JSON.parse(localStorage.getItem("SELECTED_BANNELS")) || []
  );
 
  function handleSubmit(e) {
    e.preventDefault();

    const { quantity, type } = formData;

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

    if (+quantity <= 0) {
      toast.warn("Please enter a positive quantity");
      return;
    }

    let isValid = false;

    if (!type) { // kg
      isValid = +quantity % 25 === 0;
    } else { // lb
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

    const variations = {
      ...formData,
      quantity,
      type,
      created_at: new Date().toISOString(),
    };

    const banelObject = {
      id: item.product_id,
      img: item.product_image,
      color: item.color,
      type: type ? "lb" : "kg",
      formData,
    };

    setSelectedBanels((prev) => [...prev, banelObject]);
    localStorage.setItem("SELECTED_BANNELS", JSON.stringify([...selectedBanels, banelObject]));

    toast.success("Banel Data has been added successfully");
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
    // setUserFormModal(true);
  }

  useEffect(() => {
    localStorage.setItem("SELECTED_BANNELS", JSON.stringify(selectedBanels));
  }, [selectedBanels]);


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
              {FINISH?.map((item) => (
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
                setFormData({ ...formData, powder_type: e.target.value })
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
              <label>
                Weight in {formData.type ? "lb" : "kg"}:
              </label>
              <input
                value={formData?.quantity || ""}
                onChange={(e) => setFormData({...formData , quantity : +e.target.value})}
                type="number"
                onWheel={(e) => e.target.blur()}
                placeholder="Quantity"
              />
            </div>

            <div className="flex gap-2 items-center mt-[30px]">
              <label>Kg</label>
              <Switch
                checked={formData.type}
                onChange={(checked) => setFormData({ ...formData, type: checked })}
              />
              <label>lb</label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-(--main-red-color) p-2 rounded-md hover:bg-[#e82f3bc1] text-white"
          >
            Next
          </button>
        </form>
      </div>

      
    </Modal>
    </div>
  );
}
