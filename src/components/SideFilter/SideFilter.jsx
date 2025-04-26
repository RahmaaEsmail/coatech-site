import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchColors } from "../../features/colorSlice";

export default function SideFilter({ selectedColor, setSelectedColor }) {
  const { colors, colorsLoading } = useSelector((state) => state?.colors);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    dispatch(handleFetchColors());
  }, [dispatch]);

  useEffect(() => {
    console.log(colors);
  }, [colors]);

  function handleToggleColor(color) {
    console.log(color);
    setSelectedColor(color);
  }
  return (
    <div className="!border-[2px] max-h-[400px] overflow-y-auto !border-gray-200 rounded-md p-3">
      <p className="font-semibold">Filter By Color</p>

      <div className="flex flex-col gap-3 mt-4">
        <label htmlFor={"all"} className="flex gap-3 items-center">
          <div
            className={`flex  border ${
              selectedColor === "all"
                ? "!border-black scale-110"
                : "!border-gray-300"
            } justify-center items-center w-7 h-7 border-[1.5px] rounded-full`}
          >
            <span
              className="!w-4 flex bg-(--main-blue-color) justify-center items-center !h-4 rounded-full p-2"
              style={{ backgroundColor: "" }}
            />
          </div>
          <input
            type="radio"
            value={"all"}
            checked={"all" == selectedColor}
            id={"all"}
            className="hidden"
            onChange={() => handleToggleColor("all")}
          />
          <span>{"All"}</span>
        </label>

        {colors?.data?.map((color) => (
          <label
            htmlFor={color?.product_color}
            className="flex gap-3 items-center"
          >
            <div
              className={`flex  border ${
                selectedColor === color?.product_color
                  ? "!border-black scale-110"
                  : "!border-gray-300"
              } justify-center items-center w-7 h-7 border-[1.5px] rounded-full`}
            >
              <span
                className="!w-4 flex justify-center items-center !h-4 rounded-full p-2"
                style={{ backgroundColor: `${color?.product_color}` }}
              />
            </div>
            <input
              type="radio"
              value={color?.product_color}
              checked={color?.product_color == selectedColor}
              id={color?.product_color}
              className="hidden"
              onChange={() => handleToggleColor(color?.product_color)}
            />
            <span>{color?.product_color}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
