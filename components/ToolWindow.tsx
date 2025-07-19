"use client"

import React, { useState, ReactNode } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

interface ToolWindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const ToolWindow: React.FC<ToolWindowProps> = ({ title, children, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      className={`fixed top-4 left-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 transition-all duration-300 ${
        isFullScreen ? "top-0 left-0 right-0 bottom-0 rounded-none" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">⚡</span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div>
          <button
            onClick={toggleFullScreen}
            className="text-gray-500 hover:text-gray-700 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
            aria-label={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        className="overflow-y-auto"
        style={{
          height: isFullScreen ? "calc(100% - 3rem)" : "calc(70vh - 2rem)", // Reduced to 70vh for better small screen fit
          maxHeight: isFullScreen ? "100%" : "calc(70vh - 2rem)", // Consistent max height
        }}
      >
        <div className="p-4">{children}</div> {/* Padding inside scrollable area */}
      </div>
    </div>
  );
};

export default ToolWindow;