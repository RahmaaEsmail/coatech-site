import React, { useEffect, useState } from "react";
import { BANELS_DATA } from "../../utils/data";
import { FaAnglesRight, FaAnglesLeft, FaFilter } from "react-icons/fa6";
import BannelModal from "../BannelModal/BannelModal";
import SideFilter from "../SideFilter/SideFilter";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchProducts } from "../../features/productsSlice";
import { Drawer, Pagination, Spin } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import UserForm from "../UserForm/UserForm";

export default function Banels({ activeStep, setActiveStep }) {
  const COATECH_USER_DATA = localStorage.getItem("COATECH_USER_DATA")
    ? JSON.parse(localStorage.getItem("COATECH_USER_DATA"))
    : null;

  const [debounceCodeValue, setDebounceCodeValue] = useState("");
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFilterSidebar, setOpenFilterSidebar] = useState(false);
  const [searchCodeValue, setSearchCodeValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userFormModal, setUserFormModal] = useState(false);

  const dispatch = useDispatch();
  const { products, productLoading } = useSelector((state) => state?.products);

  const indexOfLastItems = pagination?.current_page * pagination?.pageSize;
  const indexOfFirstItems = indexOfLastItems - pagination?.pageSize;

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current_page: page, pageSize });
  };

  // Reset pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  }, [selectedColor, selectedCategory, searchCodeValue, debouncedSearch]);

  useEffect(() => {
    const keyword = debouncedSearch?.length && debouncedSearch?.toLowerCase();
    let filtered = products?.data || [];

    // Apply color filter
    if (selectedColor && selectedColor !== "all") {
      filtered = filtered.filter(
        (item) =>
          item?.product_color?.toLowerCase() === selectedColor.toLowerCase()
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item?.product_category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // Apply search code filter
    if (searchCodeValue?.length > 0) {
      filtered = filtered.filter((item) =>
        item?.product_name
          ?.toLowerCase()
          .includes(searchCodeValue.toLowerCase())
      );
    }

    // Apply general search filter
    if (keyword) {
      filtered = filtered.filter(
        (item) =>
          item.product_name?.toLowerCase().includes(keyword) ||
          item.product_color?.toLowerCase().includes(keyword) ||
          item.product_category?.toLowerCase().includes(keyword)
      );
    }

    setFilteredData(filtered);
    setAllBanels(filtered);
  }, [
    debouncedSearch,
    selectedColor,
    selectedCategory,
    products,
    searchCodeValue,
  ]);

  useEffect(() => {
    dispatch(handleFetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setAllBanels(products?.data);
  }, [products]);

  useEffect(() => {
    console.log(searchCodeValue, selectedCategory);
  }, [searchCodeValue, selectedCategory]);
  return (
    <div className="flex flex-col gap-4 my-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-center text-gray-900">Bannels</h3>

        <div className="flex items-center gap-2">
          {/* <button
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50"
            onClick={() => setActiveStep((prev) => prev - 1)}
            disabled={activeStep === 0}
          >
            <FaAnglesLeft />
          </button> */}

          <button
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50"
            onClick={() => setUserFormModal(true)}
          >
            Proceed to next step
          </button>
        </div>
      </div>

      <div
        onClick={() => setOpenFilterSidebar(true)}
        className="bg-(--main-blue-color) flex justify-center items-center gap-2 p-2 w-fit rounded-md  lg:hidden mb-4"
      >
        <FaFilter className="text-white" />
        <span className="text-white">Filters</span>
      </div>

      <div className="grid gap-3 grid-cols-1 lg:grid-cols-[3fr_9fr]">
        <div className="hidden lg:block">
          <ErrorBoundary fallback={<h2>Error While Loading Filters</h2>}>
            <SideFilter
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSearchCodeValue={setSearchCodeValue}
              searchCodeValue={searchCodeValue}
            />
          </ErrorBoundary>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-full">
            <input
              onChange={(e) => setSearchValue(e.target.value)}
              className="!rounded-[50px] p-3 !px-5 w-full !border-[2px] !border-gray-200"
              placeholder="Search For Products"
            />
          </div>

          {productLoading && (
            <div className="h-40 flex justify-center items-center">
              <Spin size="large" />
            </div>
          )}

          <ErrorBoundary
            resetKeys={[allBanels]}
            fallback={<h2>Error While Loading Banels</h2>}
          >
            {allBanels?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-y-3 gap-4">
                {allBanels
                  ?.slice(indexOfFirstItems, indexOfLastItems)
                  .map((item) => (
                    <div
                      key={item.product_id}
                      onClick={() => {
                        setSelectedData(item);
                        setOpenModal(true);
                      }}
                      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg p-4"
                    >
                      <LazyLoadImage
                        effect="blur"
                        placeholderSrc={item?.product_image}
                        wrapperProps={{
                          // If you need to, you can tweak the effect transition using the wrapper style.
                          style: { transitionDelay: "1s" },
                        }}
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-48 object-contain rounded-md mb-3"
                      />
                      <p className="font-semibold text-gray-900 text-center">
                        {item.product_name}
                      </p>
                      <p className="text-gray-400 text-sm text-center">
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
          </ErrorBoundary>
        </div>
      </div>

      <div className="flex my-3 justify-center items-center w-full">
        <Pagination
          onChange={handlePageChange}
          current={pagination?.current_page}
          pageSize={pagination?.pageSize}
          total={filteredData?.length}
        />
      </div>

      <BannelModal
        allBanels={allBanels}
        setAllBanels={setAllBanels}
        open={openModal}
        item={selectedData}
        setOpen={setOpenModal}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
      />

      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setOpenFilterSidebar(false)}
        open={openFilterSidebar}
        width={250}
      >
        <SideFilter
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </Drawer>

      <UserForm
        setActiveStep={setActiveStep}
        open={userFormModal}
        setOpen={setUserFormModal}
      />
    </div>
  );
}
