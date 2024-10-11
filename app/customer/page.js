"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter(); // To navigate to the customer detail page

  // Fetch all customers
  async function fetchCustomers() {
    const data = await fetch(`/api/customer`);
    const customers = await data.json();
    setCustomers(customers);
  }

  // Start editing a customer
  const startEdit = (customer) => () => {
    setEditMode(true);
  
    // Convert the dateOfBirth to YYYY-MM-DD format
    const formattedCustomer = {
      ...customer,
      dateOfBirth: new Date(customer.dateOfBirth).toISOString().split("T")[0],
    };
  
    reset(formattedCustomer); // Pre-fill form with customer data, including formatted date
  };

  // Create or update a customer
  const createOrUpdateCustomer = async (data) => {
    if (editMode) {
      // Update existing customer
      const response = await fetch(`/api/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert(`Failed to update customer: ${response.status}`);
      } else {
        alert("Customer updated successfully");
        setEditMode(false);
        resetForm();
        fetchCustomers();
      }
      return;
    }

    // Create new customer
    const response = await fetch(`/api/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alert(`Failed to create customer: ${response.status}`);
    } else {
      alert("Customer added successfully");
      resetForm();
      fetchCustomers();
    }
  };

  // Delete a customer
  const deleteCustomer = (id) => async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    const response = await fetch(`/api/customer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Failed to delete customer: ${response.status}`);
    } else {
      alert("Customer deleted successfully");
      fetchCustomers();
    }
  };

  // Navigate to the customer detail page
  const viewCustomerDetail = (id) => {
    router.push(`/customer/${id}`);
  };

  // Reset form after submission or cancel
  const resetForm = () => {
    reset({
      name: "",
      dateOfBirth: "",
      memberNumber: "",
      interests: "",
    });
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Form for adding/updating customers */}
        <div className="w-full md:w-1/3">
          <form onSubmit={handleSubmit(createOrUpdateCustomer)} className="p-4 border rounded">
            <h2 className="text-xl font-bold">{editMode ? "Update" : "Add"} Customer</h2>
            <div className="mt-4">
              <label className="block mb-2">Name:</label>
              <input
                name="name"
                {...register("name", { required: true })}
                className="border w-full p-2"
                type="text"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2">Date of Birth:</label>
              <input
                name="dateOfBirth"
                {...register("dateOfBirth", { required: true })}
                className="border w-full p-2"
                type="date"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2">Member Number:</label>
              <input
                name="memberNumber"
                {...register("memberNumber", { required: true })}
                className="border w-full p-2"
                type="number"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2">Interests:</label>
              <input
                name="interests"
                {...register("interests", { required: true })}
                className="border w-full p-2"
                type="text"
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className={`${editMode ? "bg-blue-600" : "bg-green-600"} text-white p-2 rounded`}
              >
                {editMode ? "Update Customer" : "Add Customer"}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setEditMode(false);
                  }}
                  className="bg-red-600 text-white p-2 rounded ml-4"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Customer List */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold">Customers List ({customers.length})</h2>
          <ul className="mt-4 space-y-2">
            {customers.map((customer) => (
              <li key={customer._id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <h3 className="font-bold text-xl">{customer.name}</h3>
                  {/* <p>Date of Birth: {new Date(customer.dateOfBirth).toLocaleDateString()}</p> */}
                  <p>Member #: {customer.memberNumber}</p>
                  {/* <p>Interests: {customer.interests}</p> */}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={startEdit(customer)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={deleteCustomer(customer._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => viewCustomerDetail(customer._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
