// Full implementation of Banels with cart handling

import React, { useEffect, useState } from "react";
import { BANELS_DATA } from "../../utils/data";
import {
  FaAnglesRight,
  FaAnglesLeft,
  FaFilter,
  FaCartPlus,
} from "react-icons/fa6";
import BannelModal from "../BannelModal/BannelModal";
import SideFilter from "../SideFilter/SideFilter";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchProducts } from "../../features/productsSlice";
import { Drawer, Pagination, Spin } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import UserForm from "../UserForm/UserForm";
import useCartHook from "../../hooks/useCart";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Banels({ activeStep, setActiveStep }) {
  const dispatch = useDispatch();
  const { products, productLoading } = useSelector((state) => state?.products);

  const [allBanels, setAllBanels] = useState([]);
  const [initialBanel, setInitialBanel] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    pageSize: 8,
  });
  const [selectedData, setSelectedData] = useState({});
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebounceSearch] = useState("");
  const [searchCodeValue, setSearchCodeValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [userFormModal, setUserFormModal] = useState(false);
  const [openFilterSidebar, setOpenFilterSidebar] = useState(false);
  const [submittedItems, setSubmittedItems] = useState([]);
  const {setCart , cart} = useCartHook();
  const [visibleCount, setVisibleCount] = useState(8); // initial batch size

  useEffect(() => {
    dispatch(handleFetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setAllBanels(products?.data || []);
    setInitialBanel(products?.data || []);
  }, [products]);

  useEffect(() => {
    const keyword = searchValue?.toLowerCase();
    let filtered = products?.data || [];
  
    if (selectedColor !== "all") {
      filtered = filtered.filter(
        (item) =>
          item?.product_color?.toLowerCase() === selectedColor.toLowerCase()
      );
    }
  
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item?.product_category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
  
    if (searchCodeValue) {
      filtered = filtered.filter((item) =>
        item?.product_name
          ?.toLowerCase()
          .includes(searchCodeValue.toLowerCase())
      );
    }
  
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
    searchValue,
    selectedColor,
    selectedCategory,
    products,
    searchCodeValue,
  ]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(searchValue);
    }, 500);
  
    return () => clearTimeout(timer);
  }, [searchValue]);
  

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    setSelectedData(item);
    setOpenModal(true);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ current_page: page, pageSize });
  };

  const indexOfLastItems = pagination.current_page * pagination.pageSize;
  const indexOfFirstItems = indexOfLastItems - pagination.pageSize;

  const fetchMoreData = () => {
    setVisibleCount((prev) => prev + 8); // load 8 more items each time
  };

  useEffect(() => {
    setVisibleCount(8);
  }, [allBanels]);

  return (
    <div className="flex flex-col gap-4 my-6">
      <div className="flex justify-end !me-3 items-center">
        <div className="flex gap-3 items-center">

          <div onClick={() =>setActiveStep(1)} className="relative shadow w-[30px] h-[30px] !right-0 flex justify-center items-center rounded-full">
            <FaCartPlus className="text-xl text-gray-600" />
            <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cart?.length >0 ? cart?.length : 0}</div>
          </div>
        </div>
      </div>

      <div
        onClick={() => setOpenFilterSidebar(true)}
        className="bg-blue-600 flex justify-center items-center gap-2 p-2 w-fit rounded-md lg:hidden mb-4"
      >
        <FaFilter className="text-white" />
        <span className="text-white">Filters</span>
      </div>

      <div className="grid gap-3 grid-cols-1 lg:grid-cols-[3fr_9fr]">
        <div className="hidden lg:block !sticky top-6 h-fit">
          <ErrorBoundary fallback={<h2>Error While Loading Filters</h2>}>
            <SideFilter
              initialBanel={initialBanel}
              setAllBanels={setAllBanels}
              allBanels={allBanels}
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
          <InfiniteScroll
            dataLength={Math.min(visibleCount, allBanels.length)}
            next={fetchMoreData}
            className="flex flex-col gap-2 hide-scrollbar"
            hasMore={visibleCount < allBanels.length}
            loader={<Spin size="large" />}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <input
              onChange={(e) => setSearchValue(e.target.value)}
              className="rounded-full p-3 px-5 border-2 border-gray-200"
              placeholder="Search For Products"
            />
            {productLoading ? (
              <div className="h-40 flex justify-center items-center">
                <Spin size="large" />
              </div>
            ) : allBanels?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
                {allBanels
                  .slice(0, visibleCount)
                  .map((item) => (
                    <div
                      key={item.product_id}
                      onClick={() => {
                        setSelectedData(item);
                        setOpenModal(true);
                      }}
                      className="rounded-xl overflow-hidden cursor-pointer transition-all shadow-lg p-4 relative group"
                    >
                      <div
                        onClick={(e) => handleAddToCart(item, e)}
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-blue-50 z-10"
                      >
                        <div className="relative flex justify-center items-center">
                          <FaCartPlus className="text-xl text-gray-600" />
                          {cart.find(
                            (c) => c.id === item.product_id
                          ) && (
                            <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                              {
                                1
                                // cartItems.find(
                                //   (c) => c.id === item.product_id
                                // )?.quantity
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      <LazyLoadImage
                        effect="blur"
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-48 object-contain flex mx-auto flex justify-center items-center rounded-md mb-3"
                      />
                      <p className="font-semibold text-gray-900 text-center">
                        {item.product_name}
                      </p>
                      <p className="text-gray-400 text-sm text-center">
                        {item.product_category}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xl flex justify-center items-center font-semibold">
                No Banels
              </p>
            )}
          </InfiniteScroll>
        </div>
      </div>


      <BannelModal
        allBanels={allBanels}
        setAllBanels={setAllBanels}
        open={openModal}
        item={selectedData}
        setOpen={setOpenModal}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        onSuccess={() => {
          if (selectedData?.product_id) {
            setSubmittedItems((prev) => [...prev, selectedData.product_id]);
          }
        }}
      />

      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setOpenFilterSidebar(false)}
        open={openFilterSidebar}
        width={250}
      >
       <SideFilter
              initialBanel={initialBanel}
              setAllBanels={setAllBanels}
              allBanels={allBanels}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSearchCodeValue={setSearchCodeValue}
              searchCodeValue={searchCodeValue}
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
