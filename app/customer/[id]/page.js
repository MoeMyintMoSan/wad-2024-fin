"use client"; // Ensure the component runs on the client side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

export default function CustomerDetailPage({ params }) {
  const router = useRouter();
  const { id } = params; // Use params to get the customer ID from the URL
  const [customer, setCustomer] = useState(null);

  // Fetch customer details when component loads
  useEffect(() => {
    if (id) {
      fetch(`/api/customer/${id}`)
        .then((response) => response.json())
        .then((data) => setCustomer(data))
        .catch((error) => console.error("Failed to fetch customer", error));
    }
  }, [id]);

  if (!customer) {
    return <p className="text-center mt-10 text-lg font-semibold">Loading customer details...</p>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Customer Details</h1>

      {/* Customer Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-700">Name:</h2>
            <p className="text-lg text-gray-600">{customer.name}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Member Number:</h2>
            <p className="text-lg text-gray-600">{customer.memberNumber}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-700">Date of Birth:</h2>
            <p className="text-lg text-gray-600">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Interests:</h2>
            <p className="text-lg text-gray-600">{customer.interests}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
