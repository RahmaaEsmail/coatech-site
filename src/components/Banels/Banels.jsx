import React, { useEffect, useState } from "react";
import { BANELS_DATA } from "../../utils/data";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import BannelModal from "../BannelModal/BannelModal";
import SideFilter from "../SideFilter/SideFilter";

export default function Banels({ activeStep, setActiveStep }) {
  // const [selectedBanels, setSelectedBanels] = useState(JSON.parse(localStorage.getItem("SELECTED_BANNELS"))||[]);
  const [allBanels , setAllBanels] = useState(BANELS_DATA || [])
  const [openModal , setOpenModal] = useState(false);
  const [selectedData , setSelectedData] = useState({});
  const [searchValue , setSearchValue] = useState("");
  const [debouncedSearch , setDebounceSearch] = useState("");
  const [selectedColor , setSelectedColor] = useState("all");

  // const handleSelect = (banel) => {
  //   const isExist = selectedBanels.some((item) => item.id === banel.id);
  //   if (isExist) {

  //     setSelectedBanels((prev) => prev.filter((item) => item.id !== banel.id));
  //   } else {
  //     setSelectedBanels((prev) => [...prev, banel]);
  //     setSelectedData(banel)
  //   }
  // };

  // const isSelected = (id) => selectedBanels.some((item) => item.id === id);

  // useEffect(() => {
  //   console.log(isSelected(2))
  // },[isSelected])

  // useEffect(() => {
  //   if (selectedBanels?.length > 0) {
  //     localStorage.setItem("SELECTED_BANNELS" , JSON.stringify(selectedBanels));
  //   }
  // }, [selectedBanels]);

  useEffect(() => {
    const timeout = setTimeout(() => {
        setDebounceSearch(searchValue)
    } , 500)

    return () => clearTimeout(timeout)
  } ,[searchValue])


   useEffect(() => {
     const keyword = debouncedSearch?.length && debouncedSearch?.toLowerCase();
     let filteredData = BANELS_DATA ;
     

     if(selectedColor) {
        filteredData = filteredData?.filter(item => item?.Attribute?.toLowerCase()?.includes(selectedColor?.toLowerCase()))
     }
      
     if(selectedColor == "all") {
        filteredData = BANELS_DATA
     }

     if(keyword) {
        filteredData = filteredData.filter(item =>
            item.color?.toLowerCase().includes(keyword) ||
            item.catelog_name?.toLowerCase().includes(keyword) ||
            item.gloss_level?.toLowerCase().includes(keyword) ||
            item.finish?.toLowerCase().includes(keyword) ||
            item.powder_type?.toLowerCase().includes(keyword)
          );
     }

     setAllBanels(filteredData)
   } ,[debouncedSearch , selectedColor]) 

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
     <SideFilter selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>

        <div className="flex flex-col gap-2">
        <div className="w-full">
        <input onChange={(e) => setSearchValue(e.target.value)} className="!rounded-[50px] p-3 !px-5 w-full !border-[2px] !border-gray-200" placeholder="Search For Products"/>
      </div>
      {allBanels?.length ?
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-y-3 gap-4">
        {
            allBanels.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedData(item);  // 👈 لازم تحدد البانل

                      // handleSelect(item)
                      setOpenModal(true)
                  }}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg p-4 `}
                >
                  <img
                    src={item.img}
                    alt={item.color}
                    className="w-full h-52 object-cover rounded-md mb-3"
                  />
                  <p className="font-semibold text-gray-900 text-center">
                    {item.color}
                  </p>
                  <p className=" text-gray-400 text-sm text-center">{item?.catelog_name}</p>
                </div>
              ))
        }
      </div>
      : <p className="text-xl flex justify-center items-center font-semibold">No Banels</p>
}
        </div>

     </div>

      <BannelModal  allBanels={allBanels} setAllBanels={setAllBanels} open={openModal} item={selectedData}  setOpen={setOpenModal}/>
    </div>
  );
}
