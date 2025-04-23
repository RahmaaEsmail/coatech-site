import React, { useEffect } from 'react'

const COLORS = [
    { name: "Black", code: "#000000" },
    { name: "Blue", code: "#00CFFF" },
    { name: "Brown", code: "#A0522D" },
    { name: "Green", code: "#90EE90" },
    { name: "Grey", code: "#A9A9A9" },
    { name: "Orange", code: "#FFA500" },
    // Add more if needed
  ];

export default function SideFilter({ selectedColor, setSelectedColor}) {
    useEffect(()=> {
        console.log(selectedColor)
    },[selectedColor])

    function handleToggleColor(color) {
        console.log(color)
        setSelectedColor(color)
    }
  return (
    <div className='!border-[2px] max-h-[400px] overflow-y-auto !border-gray-200 rounded-md p-3'>
        <p className='font-semibold'>Filter By Color</p>

        <div className="flex flex-col gap-3 mt-4">
        <label htmlFor={"all"} className='flex gap-3 items-center'>
            <div className={`flex  border ${
            selectedColor === "all"
                  ? "!border-black scale-110"
                  : "!border-gray-300"
            } justify-center items-center w-7 h-7 border-[1.5px] rounded-full`}>
            <span
              className="!w-4 flex bg-(--main-blue-color) justify-center items-center !h-4 rounded-full p-2"
              style={{ backgroundColor: "" }}
            />
            </div>
            <input type="radio" 
            value={"all"}
            checked ={"all" == selectedColor}
            id={"all"} className='hidden'
            onChange={() =>handleToggleColor("all") } />
            <span>{"All"}</span>
           </label>
           {COLORS?.map(color => 
           
           <label htmlFor={color.name} className='flex gap-3 items-center'>
            <div className={`flex  border ${
            selectedColor === color.name
                  ? "!border-black scale-110"
                  : "!border-gray-300"
            } justify-center items-center w-7 h-7 border-[1.5px] rounded-full`}>
            <span
              className="!w-4 flex justify-center items-center !h-4 rounded-full p-2"
              style={{ backgroundColor: color.code }}
            />
            </div>
            <input type="radio" 
            value={color.name}
            checked ={color.name == selectedColor}
            id={color.name} className='hidden'
            onChange={() =>handleToggleColor(color?.name) } />
            <span>{color?.name}</span>
           </label>)}
        </div>
    </div>
  )
}
