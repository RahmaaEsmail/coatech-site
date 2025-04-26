import React, { useEffect, useState } from "react";
import { BANELS_DATA } from "../../utils/data";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import BannelModal from "../BannelModal/BannelModal";
import SideFilter from "../SideFilter/SideFilter";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchProducts } from "../../features/productsSlice";
import { handleFetchColors } from "../../features/colorSlice";
import { Pagination, Spin } from "antd";

export default function Banels({ activeStep, setActiveStep }) {
  // const [selectedBanels, setSelectedBanels] = useState(JSON.parse(localStorage.getItem("SELECTED_BANNELS"))||[]);
  const [allBanels, setAllBanels] = useState(BANELS_DATA || []);
  const [pagination, setPagination] = useState({
    current_page: 1,
    pageSize: 8,
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebounceSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState("all");
  const dispatch = useDispatch();
  const { products, productLoading } = useSelector((state) => state?.products);
  const indexOfLastItems = pagination?.current_page * pagination?.pageSize;
  const indexOfFirstItems = indexOfLastItems - pagination?.pageSize;

  const handlePageChange = (page, pageSize) => {
    console.log(page, pageSize);
    setPagination({ ...pagination, current_page: page, pageSize });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(searchValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    const keyword = debouncedSearch?.length && debouncedSearch?.toLowerCase();
    let filteredData = products?.data;

    if (selectedColor) {
      filteredData = filteredData?.filter((item) =>
        item?.product_color
          ?.toLowerCase()
          ?.includes(selectedColor?.toLowerCase())
      );
    }

    if (selectedColor == "all") {
      filteredData = products?.data;
    }

    if (keyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.product_color?.toLowerCase().includes(keyword) ||
          item.product_category?.toLowerCase().includes(keyword)
      );
    }

    setAllBanels(filteredData);
  }, [debouncedSearch, selectedColor]);

  useEffect(() => {
    dispatch(handleFetchProducts());
  }, [dispatch]);

  useEffect(() => {
    console.log(products);
    setAllBanels(products?.data);
  }, [products]);

  return (
    <div className="flex flex-col gap-4 my-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-900">
          Select Bannel <span className="text-[#E82F3C]">*</span>:
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

      <div className="grid gap-3 grid-cols-[3fr_9fr]">
        <SideFilter
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />

        <div className="flex flex-col gap-2">
          <div className="w-full">
            <input
              onChange={(e) => setSearchValue(e.target.value)}
              className="!rounded-[50px] p-3 !px-5 w-full !border-[2px] !border-gray-200"
              placeholder="Search For Products"
            />
          </div>
          {productLoading && (
            <div className="h-screen flex justify-center items-center">
              <Spin size="large" />
            </div>
          )}

          {allBanels?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-y-3 gap-4">
              {allBanels
                ?.slice(indexOfFirstItems, indexOfLastItems)
                .map((item) => (
                  <div
                    key={item.product_id}
                    onClick={() => {
                      setSelectedData(item); // 👈 لازم تحدد البانل

                      // handleSelect(item)
                      setOpenModal(true);
                    }}
                    className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg p-4 `}
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-52 object-cover rounded-md mb-3"
                    />
                    <p className="font-semibold text-gray-900 text-center">
                      {item.product_name}
                    </p>
                    <p className=" text-gray-400 text-sm text-center">
                      {item?.product_category}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xl flex justify-center items-center font-semibold">
              No Banels
            </p>
          )}
        </div>
      </div>

      <div className="flex my-3 justify-center items-center">
        <Pagination
          onChange={handlePageChange}
          current={pagination?.current_page}
          pageSize={pagination?.pageSize}
          total={products?.data?.length}
        />
      </div>

      <BannelModal
        allBanels={allBanels}
        setAllBanels={setAllBanels}
        open={openModal}
        item={selectedData}
        setOpen={setOpenModal}
      />
    </div>
  );
}
