import Customer from "@/models/Customer";

// GET all customers
export async function GET(request) {
  try {
    const customers = await Customer.find();
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching customers", error }), { status: 500 });
  }
}

// POST a new customer
export async function POST(request) {
  try {
    const body = await request.json();
    const customer = new Customer(body);
    await customer.save();
    return new Response(JSON.stringify(customer), { status: 201 }); // 201 Created
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating customer", error }), { status: 500 });
  }
}

// PUT to update an existing customer (by ID)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    const updatedCustomer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!updatedCustomer) {
      return new Response(JSON.stringify({ message: "Customer not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedCustomer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating customer", error }), { status: 500 });
  }
}

// PATCH to update part of an existing customer (by ID)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    const updatedCustomer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedCustomer) {
      return new Response(JSON.stringify({ message: "Customer not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedCustomer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating customer", error }), { status: 500 });
  }
}
