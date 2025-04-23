import React, { useEffect, useState } from "react";
import Banels from "./components/Banels/Banels";
import { ToastContainer } from "react-toastify";
import UserForm from "./components/UserForm/UserForm";
import Summary from "./components/Summary/Summary";

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const selectedBannles = localStorage?.getItem("SELECTED_BANNELS") ? JSON.parse(localStorage.getItem("SELECTED_BANNELS")) : null
  const [numberOfBanels , setNumberOfBanels] = useState(0)
  
  useEffect(() => {
    setNumberOfBanels(selectedBannles?.length || 0)
  } , [selectedBannles])

  const steps = [
    { id: 0, title: "Bannels" },
    { id: 1, title: "Account Info" },
    { id: 2, title: `Summary(${numberOfBanels})` },
  ];

  useEffect(() => {
    console.log(activeStep);
  }, [activeStep]);

  return (
    <>
      <div className="p-6">
        <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-white bg-[rgba(9,33,67,1)] border border-gray-700 rounded-lg shadow-sm sm:text-base sm:p-4 sm:space-x-4 rtl:space-x-reverse">
          {steps.map((step, index) => (
            <li
              onClick={() => setActiveStep(step?.id)}
              key={index}
              className={`flex items-center cursor-pointer ${
                index === activeStep
                  ? "text-white dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 me-2 text-xs border rounded-full font-bold transition ${
                  index === activeStep
                    ? "bg-white shadow-md text-gray-500 border-white"
                    : "border-gray-500 text-gray-300"
                }`}
              >
                {index + 1}
              </span>

              {step.title}
              {index < steps.length - 1 && (
                <svg
                  style={{ width: "14px", height: "14px" }}
                  className="!w-[14px] !h-[14px] ms-2 sm:ms-4 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 12 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m7 9 4-4-4-4M1 9l4-4-4-4"
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>

        {activeStep == 0 && (
          <Banels activeStep={activeStep} setActiveStep={setActiveStep} />
        )}

        {activeStep == 1 && (
          <UserForm activeStep={activeStep} setActiveStep={setActiveStep} />
        )}

{activeStep == 2 && (
          <Summary activeStep={activeStep} setActiveStep={setActiveStep} />
        )}
      </div>
      <ToastContainer />
    </>
  );
}
