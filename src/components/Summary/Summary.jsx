import React, { useEffect, useState } from "react";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import { Table } from "antd";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { handleCreateQuote } from "../../features/quotationsSlice";
import { toast } from "react-toastify";

export default function Summary({ activeStep, setActiveStep }) {
  const userData = JSON.parse(localStorage?.getItem("COATECH_USER_DATA")) || {};
  const { quotations, isLoading } = useSelector((state) => state?.quotations);
  const dispatch = useDispatch();

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "img",
      key: "img",
      title: "Banel Image",
      render: (row) => (
        <img
          src={row}
          className="w-[100px] h-[100px] rounded-md object-cover"
        />
      ),
    },
    {
      dataIndex: "",
      key: "",
      title: "Name",
      render:(row) => {
        console.log(row)
        return(  
          <p>{row?.formData?.color}</p>
        )
      }
    },
    {
      key: "details",
      title: "Details",
      render: (row) => {
        console.log(row);
        return (
          <div className="flex max-w-[700px] flex-wrap gap-2">
            <>
              {row?.formData?.catelog_name && (
                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                  Catalog: {row?.formData?.catelog_name}
                </span>
              )}
              {row?.formData?.powder_type && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Powder: {row?.formData?.powder_type}
                </span>
              )}
              {row?.formData?.finish && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Finish: {row?.formData?.finish}
                </span>
              )}
              {row?.formData?.gloss_level && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Gloss: {row?.formData?.gloss_level}
                </span>
              )}
              {row?.formData?.clear_coats && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  Coats: {row?.formData?.clear_coats}
                </span>
              )}

              {row?.formData?.Attribute && (
                <span
                  style={{ backgroundColor: `${row?.formData?.Attribute}` }}
                  className=" text-white text-xs px-2 py-1 rounded-full"
                >
                  Attribute: {row?.formData?.Attribute}
                </span>
              )}
            </>
          </div>
        );
      },
    },
    {
      dataIndex: "",
      key: "quantity",
      title: "Weight",
      render: (row) => (
        <div>
          {row?.formData?.quantity
            ? `${Math.round(row?.formData?.quantity)} Kg`
            : "--"}
        </div>
      ),
    },
  ];

  const user_columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      render: (row) => <a href={`mailto:${row}`}>{row}</a>,
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone",
      render: (row) => <a href={`tel:${row}`}>{row}</a>,
    },
    {
      dataIndex: "company_name",
      key: "company_name",
      title: "Company Name",
    },
    {
      dataIndex: "address",
      key: "address",
      title: "Address",
    },
    {
      dataIndex: "region",
      key: "region",
      title: "Country",
    },
    {
      dataIndex: "city",
      key: "city",
      title: "City",
    },

  ];

  const [originalBanels, setOriginalBanels] = useState(
    JSON.parse(localStorage.getItem("SELECTED_BANNELS")) || []
  );
  const [selectedBanels, setSelectedBanels] = useState(originalBanels);

  function handleSubmit() {
    const data_send = {
      ...userData,
      ...(originalBanels?.length > 0 && {
        product_ids: originalBanels.map((item) => ({
          id: item?.id,
          quantity: item?.formData?.quantity,
          type: item?.formData?.type,
          props: JSON.stringify(item),
        })),
      }),
    };
    console.log(data_send);
    dispatch(handleCreateQuote({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.message == "Quote created successfully") {
          toast.success(res?.message);
          localStorage.removeItem("SELECTED_BANNELS");
          setActiveStep(0);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error(e);
      });
  }

 useEffect(() => {
  console.log(originalBanels)
 } ,[originalBanels])

  return (
    <div className="flex flex-col gap-4 my-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-900">
          Choosed Bannel <span className="text-[#E82F3C]">*</span>:
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
            disabled={activeStep === 2}
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>

      <div className="p-2 rounded-md  mt-3">
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={selectedBanels || []}
        />
      </div>

      {userData && (
        <>
          <h3 className="font-bold text-lg text-gray-900">
            User Data <span className="text-[#E82F3C]">*</span>:
          </h3>

          <div className="p-2 rounded-md  mt-3">
            <Table
              scroll={{ x: "max-content" }}
              columns={user_columns}
              dataSource={[userData] || []}
            />
          </div>
        </>
      )}

      <button
        onClick={handleSubmit}
        className="mt-4 bg-(--main-red-color) ms-auto w-fit text-white p-2 rounded-md"
      >
        Submit
      </button>
    </div>
  );
}
