import { Modal } from "antd";
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

export default function BannelModal({
  open,
  setOpen,
  item,
}) {
  const [formData, setFormData] = useState({
    catelog_name: "",
    color: "",
    powder_type: "",
    finish: "",
    gloss_level: "",
    clear_coats: "",
    type:"kg",
    quantity: null,
  });

  const [selectedBanels, setSelectedBanels] = useState(
    JSON.parse(localStorage.getItem("SELECTED_BANNELS")) || []
  );
  

  function handleSubmit(e) {
    e.preventDefault();
  
    const { quantity, type } = formData;
  
    if (+quantity <= 0) {
      toast.warn("Please enter a positive quantity");
      return;
    }
  
    let isValid = false;
  
    if (type === "kg") {
      isValid = +quantity % 25 === 0;
    } else if (type === "lb") {
      const mod = +quantity % 55.116;
      isValid = mod < 0.01 || mod > 55.106;
    }
  
    if (!isValid) {
      toast.warn(
        `Please enter a quantity that is a multiple of ${
          type === "kg" ? "25" : "55.116"
        } (${type.toUpperCase()})`
      );
      return;
    }

    const variations = {
      ...formData,
      quantity,
      type,
    created_at: new Date().toISOString()
    }

    const banelObject = {
      id: item.id,
      img: item.img,
      color: item.color,
      formData
    };

    setSelectedBanels((prev) => [...prev, banelObject]);  
  
    // const data_send = {
    //   ...formData,
    //   quantity: +quantity,
    //   type,
    // };
  
    // setSelectedBanels((prev) => {
    //   const isExist = prev?.some((banel) => banel?.id === item?.id);
  
    //   if (isExist) {
    //     return prev?.map((banel) =>
    //       banel?.id === item?.id ? ({[ ...banel, ...data_send] }) : banel
    //     );
    //   } else {
    //     return [...prev, data_send];
    //   }
    // });
  
    toast.success("Banel Data has been added successfully");
    setOpen(false);
    setFormData({
      catelog_name: "",
      color: "",
      powder_type: "",
      finish: "",
      gloss_level: "",
      clear_coats: "",
      type: "kg",
      quantity: 1,
    });
  }
  

  useEffect(() => {
    localStorage.setItem("SELECTED_BANNELS", JSON.stringify(selectedBanels));
  }, [selectedBanels]);

  return (
    <Modal
      footer={null}
      width={"800px"}
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
    >
      <div className="grid grid-cols-2 gap-2 items-center">
        <div className="w-fit">
          <img src={item?.img} className="object-cover" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label>
              <span>Catalog</span>
              <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.catelog_name}
              onChange={(e) =>
                setFormData({ ...formData, catelog_name: e.target.value })
              }
            >
              <option value="" disabled>
                Select Catalog
              </option>
              {catalogs?.map((item) => (
                <option key={item?.id} value={item?.name}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>
              <span>Color</span>
            </label>
            <select
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            >
              <option value="" disabled>
                Select Color
              </option>
              {ALL_COLORS?.map((item) => (
                <option key={item?.ID} value={item?.Name}>
                  {item?.Name}
                </option>
              ))}
            </select>
          </div>

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
              <span>Powder Type</span>
            </label>
            <select
              value={formData.powder_type}
              onChange={(e) =>
                setFormData({ ...formData, powder_type: e.target.value })
              }
            >
              <option value="" disabled>
                Select Powder Type
              </option>
              {POWDER_TYPES?.map((item) => (
                <option key={item?.id} value={item?.value}>
                  {item?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>
              <span>Clear Coats</span>
            </label>
            <select
              value={formData.clear_coats}
              onChange={(e) =>
                setFormData({ ...formData, clear_coats: e.target.value })
              }
            >
              <option value="" disabled>
                Select Clear Coats
              </option>
              {CLEAR_COATS?.map((item) => (
                <option key={item?.id} value={item?.label}>
                  {item?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-center">
          <div className="input-group w-full">
            <label>Type :</label>
            <select value={formData?.type} onChange={(e) => setFormData({...formData, type:e.target.value })}>
               <option disabled selected value="">Select Weight</option>
               <option value="lb">Pound</option>
               <option value="kg">Kilogram</option>
            </select>
          </div>          
 
          {<div className="input-group w-full">
            <label>Weight in {formData?.type && formData.type}:</label>
            <input value={formData?.quantity} onChange={(e) => setFormData({...formData , quantity: +e.target.value})} type="number" onWheel={(e) =>e.target.blur()} placeholder="Quantity"/>
            {/* <p className="!font-semibold">Note: 1 Box = 25 Kg</p> */}
          </div>}
          </div>

          <button
            type="submit"
            className="bg-(--main-red-color) p-2 rounded-md hover:bg-[#e82f3bc1] text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
}
