import { Modal } from 'antd'
import React from 'react'

export default function SummaryDetails({open , setOpen , item}) {
    console.log(item)
  return (
    <Modal open={open} width={600} onClose={() => setOpen(false)} onCancel={() => setOpen(false)} footer={null}>
        <h3 className='font-semibold text-[17px]'>Product Details</h3>
        <div className='grid grid-cols-2 items-center gap-2'>
            <div>
                {<img src={item?.img}/>}
            </div>
            <div className='flex flex-col gap-2'>
                <div className='flex border-b border-gray-200 pb-2'>
                    <p className='font-bold'>Catalog : </p>
                    <p>{item?.catelog_name}</p>
                </div>
                
                <div className='flex border-b border-gray-200 pb-2'>
                    <p className='font-bold'>Color : </p>
                    <p>{item?.color}</p>
                </div>

                <div className='flex border-b border-gray-200 gap-2 pb-2'>
                    <p className='font-bold'>Attribute : </p>
                    {/* <p>{item?.Attribute}</p> */}
                    <p className={`w-6 h-6 rounded-full bg-[${item?.Attribute}]`} style={{backgroundColor:`${item?.Attribute}`}}></p>
                </div>

                <div className='flex border-b border-gray-200 pb-2'>
                    <p className='font-bold'>Color Coats : </p>
                    <p>{item?.clear_coats}</p>
                </div>
                <div className='flex border-b border-gray-200 pb-2'>
                    <p className='font-bold'>Finish : </p>
                    <p>{item?.finish}</p>
                </div>
                <div className='flex border-b border-gray-200 pb-2'>
                    <p className='font-bold'>Gloss Lavel : </p>
                    <p>{item?.gloss_level
                    }</p>
                </div>
                <div className='flex pb-2'>
                    <p className='font-bold'>Powder Type : </p>
                    <p>{item?.powder_type
                    }</p>
                </div>

            </div>
        </div>
    </Modal>
  )
}
