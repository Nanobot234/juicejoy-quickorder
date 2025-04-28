
import React from "react";

const BusinessSettingsTab: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Business Settings</h2>
      <p className="text-gray-600 mb-4">
        Configure your store settings, hours, and preferences here.
      </p>
      <div className="space-y-4">
        <p>Store settings will be available in a future update.</p>
      </div>
    </div>
  );
};

export default BusinessSettingsTab;
