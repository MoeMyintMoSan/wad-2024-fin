import Customer from "@/models/Customer";

// GET customer by ID
export async function GET(request, { params }) {
  const id = params.id;
  const customer = await Customer.findById(id);
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  console.log({ customer });
  return new Response(JSON.stringify(customer), { status: 200 });

}

// DELETE customer by ID
export async function DELETE(request, { params }) {
  const id = params.id;
  const deletedCustomer = await Customer.findByIdAndDelete(id);
  if (!deletedCustomer) {
    return new Response("Customer not found", { status: 404 });
  }
  return new Response(JSON.stringify(deletedCustomer), { status: 200 });

}
