import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchColors } from "../../features/colorSlice";
import { FaFilter } from "react-icons/fa6";
import { IoChevronDownOutline } from "react-icons/io5";

export default function SideFilter({
  selectedColor,
  setSelectedColor,
  selectedCategory,
  setSelectedCategory,
  setSearchCodeValue,
  searchCodeValue,
  allBanels,
  setAllBanels,
  initialBanel,
}) {
  const { colors, colorsLoading } = useSelector((state) => state?.colors);
  const dispatch = useDispatch();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: "RAL",
      label: "RAL",
      subcategories: [],
    },
    {
      id: "Specialities",
      label: "Special Effects",
      subcategories: [],
    },
  ]);

  useEffect(() => {
    dispatch(handleFetchColors());
  }, [dispatch]);

  useEffect(() => {
    if (initialBanel) {
      const uniqueSubcategories = {};
      initialBanel.forEach((product) => {
        if (!uniqueSubcategories[product.product_category]) {
          uniqueSubcategories[product.product_category] = new Set();
        }
        if (product.product_sub_category && 
            product.product_sub_category !== "0" && 
            product.product_sub_category !== "" && 
            product.product_sub_category !== null) {
          uniqueSubcategories[product.product_category].add(product?.product_sub_category);
        }
      });

      const updatedCategories = categories.map((category) => ({
        ...category,
        subcategories: Array.from(uniqueSubcategories[category.id] || []).map((sub) => ({
          id: sub,
          label: sub,
        })),
      }));

      setCategories(updatedCategories);
    }
  }, [initialBanel]);

  function handleToggleColor(color) {
    setSelectedColor(selectedColor === color ? "all" : color);
  }

  function handleCategoryClick(categoryId) {
    if (openDropdownId === categoryId) {
      setOpenDropdownId(null);
      setAllBanels(initialBanel);
    } else {
      setOpenDropdownId(categoryId);
      setSelectedCategory(categoryId);
      setSelectedProduct(null);
      const filteredProducts = initialBanel.filter((product) => product?.product_category === categoryId);
      setAllBanels(filteredProducts);
    }
  }

  function handleSubcategoryClick(categoryId, subcategoryId) {
    if (selectedSubcategory !== subcategoryId) {
      setSelectedSubcategory(subcategoryId);
      setSelectedProduct(null);
      const filteredProducts = initialBanel.filter(
        (product) =>
          product?.product_category === categoryId && 
          product?.product_sub_category === subcategoryId
      );
      setAllBanels(filteredProducts);
    }
  }

  function handleProductClick(prod) {
    if (selectedProduct?.product_id === prod?.product_id) {
      setSelectedProduct(null);
      const filteredProducts = initialBanel.filter(
        (product) =>
          product?.product_category === selectedCategory &&
          product?.product_sub_category === selectedSubcategory
      );
      setAllBanels(filteredProducts);
    } else {
      setSelectedProduct(prod);
      setAllBanels([prod]);
    }
  }

  const filteredCategories = categories.filter((category) =>
    category?.label?.toLowerCase().includes(searchCodeValue?.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Color Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-600" />
          <p className="font-semibold text-gray-800">Filter By Color</p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 items-center">
          {colors?.data?.map((color) => (
            <label
              key={color?.product_color}
              className="relative flex justify-center items-center group cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <div
                className={`flex border-2 ${
                  selectedColor === color?.product_color
                    ? "!border-blue-500 scale-110"
                    : "!border-gray-200 group-hover:border-gray-300"
                } justify-center items-center w-9 h-9 rounded-full transition-all duration-200`}
              >
                <span
                  className="!w-7 !h-7 rounded-full"
                  style={{ backgroundColor: color?.product_color }}
                />
              </div>
              <div
                onClick={() => handleToggleColor(color?.product_color)}
                className="absolute inset-0 rounded-lg"
                style={{ cursor: "pointer" }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchCodeValue}
          onChange={(e) => setSearchCodeValue(e.target.value)}
          className="mb-3 w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <div className="flex flex-col gap-2">
          {filteredCategories.length === 0 && (
            <span className="text-gray-400 text-sm">No categories found.</span>
          )}
          {filteredCategories.map((category) => (
            <div key={category.id} className="flex flex-col">
              <div className="bg-white border-b border-gray-100">
                <label
                  className="flex items-center justify-between gap-2 py-2 px-1 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex gap-1 items-center">
                    <input
                      type="radio"
                      checked={selectedCategory === category.id}
                      onChange={() => {}}
                      className="accent-blue-500 w-4 h-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-gray-700">{category.label}</span>
                  </div>
                  <IoChevronDownOutline
                    className={`transition-transform duration-200 ${
                      openDropdownId === category.id ? "rotate-180" : ""
                    }`}
                  />
                </label>
              </div>

              {(openDropdownId === category.id &&
                (category.subcategories?.length > 0 ||
                  initialBanel.some(
                    (product) =>
                      product.product_category === category.id &&
                      (!selectedSubcategory ||
                        product.product_sub_category === selectedSubcategory)
                  ))) && (
                <div className="pl-4 mt-3">
                  {category?.subcategories?.length > 0 && 
                   category.subcategories.some(sub => 
                     sub.id && sub.id !== "0" && sub.id !== "" && sub.id !== null
                   ) && (
                    <div className="flex flex-col gap-1">
                      <div 
                        className="flex items-center justify-between py-2 px-2 cursor-pointer hover:bg-gray-50 rounded-lg"
                        onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
                      >
                        <span className="text-sm font-medium text-gray-700">Subcategories</span>
                        <IoChevronDownOutline
                          className={`transition-transform duration-200 ${
                            isSubcategoryOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {isSubcategoryOpen && (
                        <div className="flex flex-col gap-1 py-2 max-h-[140px] overflow-y-auto bg-gray-50 rounded-lg px-2 mb-3">
                          {category.subcategories
                            .filter(sub => sub.id && sub.id !== "0" && sub.id !== "" && sub.id !== null)
                            .map((subcategory) => (
                              <div
                                key={subcategory.id}
                                onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                                className={`py-1.5 px-2 text-sm cursor-pointer rounded-md transition-all duration-200 ${
                                  selectedSubcategory === subcategory.id
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "text-gray-600 hover:bg-white"
                                }`}
                              >
                                {subcategory.label}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Products section */}
                  <div className="max-h-[200px] mt-3 overflow-y-auto border border-gray-100 rounded-lg bg-white">
                    {initialBanel
                      ?.filter(
                        (product) =>
                          product.product_category === category.id &&
                          (!selectedSubcategory ||
                            (product.product_sub_category && 
                             product.product_sub_category !== "0" && 
                             product.product_sub_category !== "" && 
                             product.product_sub_category !== null && 
                             product.product_sub_category === selectedSubcategory))
                      )
                      .sort((a, b) => {
                        const numA = parseInt(a.product_name.match(/\d+$/)?.[0] || "0", 10);
                        const numB = parseInt(b.product_name.match(/\d+$/)?.[0] || "0", 10);
                        return numA - numB;
                      })
                      .map((product) => (
                        <div
                          onClick={() => handleProductClick(product)}
                          key={product.id}
                          className={`py-2.5 px-3 text-sm cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                            selectedProduct?.product_id === product?.product_id
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {product.product_name}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
