import React, { useEffect, useState } from "react";
import { FaAnglesRight, FaAnglesLeft, FaTrash, FaBoxOpen } from "react-icons/fa6";
import { Table } from "antd";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { handleCreateQuote } from "../../features/quotationsSlice";
import { toast } from "react-toastify";
import UserForm from "../UserForm/UserForm";
import useBanelsHook from "../../hooks/useBanels";

export default function Summary({ activeStep, setActiveStep }) {
  const userData = JSON.parse(localStorage?.getItem("COATECH_USER_DATA")) || {};
  const { quotations, isLoading } = useSelector((state) => state?.quotations);
  const dispatch = useDispatch();
  const { setBanels, banels } = useBanelsHook();
  const [openUserModal, setOpenUserModal] = useState(false);

  // Initialize selectedBanels from localStorage
  const [selectedBanels, setSelectedBanels] = useState(() => {
    const storedItems = localStorage.getItem("COATECH_CART_ITEMS");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  // Update banels when selectedBanels changes
  useEffect(() => {
    setBanels(selectedBanels);
  }, [selectedBanels, setBanels]);

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
      dataIndex: "formData",
      key: "formData",
      title: "Name",
      render: (formData) => (
        <p>{formData?.color || 'N/A'}</p>
      )
    },
    {
      key: "details",
      title: "Details",
      render: (row) => {
        return (
          <div className="flex max-w-[700px] flex-wrap gap-2">
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
                className="text-white text-xs px-2 py-1 rounded-full"
              >
                Attribute: {row?.formData?.Attribute}
              </span>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "formData",
      key: "quantity",
      title: "Weight",
      render: (formData) => (
        <div>
          {formData?.quantity
            ? `${Math.round(formData?.quantity)} Kg`
            : "--"}
        </div>
      ),
    },
    {
      key: "action",
      title: "Action",
      render: (_, record) => (
        <button
          onClick={() => {
            const newBanels = selectedBanels.filter((item) => item.id !== record.id);
            setSelectedBanels(newBanels);
            localStorage.setItem("COATECH_CART_ITEMS", JSON.stringify(newBanels));
          }}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
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
        </div>
      </div>

      <div className="p-2 rounded-md mt-3">
        {selectedBanels?.length > 0 ? (
          <Table
            scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={selectedBanels}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg">
            <FaBoxOpen className="text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Colors Selected</h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven’t chosen any colors yet. Please go back and select your colors to generate a quotation.
            </p>
            <button
              onClick={() => setActiveStep((prev) => prev - 1)}
              className="mt-6 px-4 py-2 bg-[#E82F3C] text-white rounded-md hover:bg-red-700 transition"
            >
              Go Back to Selection
            </button>
          </div>
        )}
      </div>

      {selectedBanels?.length > 0 && (
        <button
          onClick={() => {
            setOpenUserModal(true);
          }}
          className="mt-4 bg-[#E82F3C] ms-auto w-fit text-white p-2 rounded-md hover:bg-red-700 transition"
        >
          Submit
        </button>
      )}

      <UserForm open={openUserModal} setActiveStep={setActiveStep} activeStep={activeStep} setOpen={setOpenUserModal} />
    </div>
  );
}
