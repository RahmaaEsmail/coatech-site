import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchColors } from "../../features/colorSlice";
import { FaFilter } from "react-icons/fa6";
import { catalogs } from "../../utils/data";

export default function SideFilter({
  selectedColor,
  setSelectedColor,
  selectedCategory,
  setSelectedCategory,
  setSearchCodeValue,
  searchCodeValue
}) {
  const { colors, colorsLoading } = useSelector((state) => state?.colors);
  const dispatch = useDispatch();
  const [openFilterColor, setOpenFilterColor] = useState(true);
  // For catalog filter
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCatalogs, setSelectedCatalogs] = useState(
    selectedCategory && Array.isArray(selectedCategory)
      ? selectedCategory
      : selectedCategory && selectedCategory !== "all"
      ? [selectedCategory]
      : []
  );

  useEffect(() => {
    dispatch(handleFetchColors());
  }, [dispatch]);

  function handleToggleColor(color) {
    setSelectedColor(color);
  }

  function handleCatalogCheckbox(value) {
    console.log(value);
    setSelectedCategory(value)
  }

  const filteredCatalogs = catalogs.filter((catalog) =>
    catalog.label.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Color Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className={`flex items-center gap-2 mb-4`}>
          <FaFilter className="text-gray-600" />
          <p className="font-semibold text-gray-800">Filter By Color</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-6 gap-2 items-center">
            {colors?.data?.map((color) => (
              <label
                key={color?.product_color}
                htmlFor={color?.product_color}
                className="flex justify-center items-center group cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <div
                  className={`flex border-2 ${
                    selectedColor === color?.product_color
                      ? "!border-blue-500 scale-110"
                      : "!border-gray-200 group-hover:border-gray-300"
                  } justify-center items-center w-9 h-9 rounded-full transition-all duration-200`}
                >
                  <span
                    className="!w-7 flex justify-center items-center !h-7 rounded-full p-"
                    style={{ backgroundColor: `${color?.product_color}` }}
                  />
                </div>
                <input
                  type="radio"
                  value={color?.product_color}
                  checked={color?.product_color === selectedColor}
                  id={color?.product_color}
                  className="hidden"
                  onChange={() => handleToggleColor(color?.product_color)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Filter - Checkbox List with Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          {/* <FaFilter className="text-gray-600" /> */}
        </div>
        <input
          type="text"
          placeholder="Search catalogs..."
          value={searchCodeValue}
          onChange={(e) => setSearchCodeValue(e.target.value)}
          className="mb-3 w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {filteredCatalogs.length === 0 && (
            <span className="text-gray-400 text-sm">No catalogs found.</span>
          )}
          {catalogs.map((catalog) => (
            <label
              key={catalog.value}
              className="flex items-center gap-2 py-2 px-1 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                checked={selectedCategory == catalog?.value}
                onChange={(e) => handleCatalogCheckbox(catalog.value)}
                className="accent-blue-500 w-4 h-4"
              />
              <span className="text-gray-700">{catalog.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
