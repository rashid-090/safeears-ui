import React from 'react'

const ShippingPolicy = () => {
  return (
    <div className='w-11/12 xl:w-10/12 mx-auto'>
<div className="space-y-8 text-gwhite text-base leading-relaxed py-10">

{/* Intro */}
<section>
  <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
  <p className="mb-2">
    It's important to note that our order processing times are separate from the shipping times you see at checkout.
  </p>
  <p className="mb-2">
    All orders are processed within <strong>3 to 5 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification once your order has shipped.
  </p>
  <p className="mb-2">
    Please allow for potential delays during high order volumes or due to issues with postal services that are beyond our control.
  </p>
</section>

{/* Domestic Shipping */}
<section>
  <h3 className="text-xl font-semibold mb-2">Domestic Shipping Rates and Estimates</h3>
  <p className="mb-2">
    <strong>Calculated shipping rates:</strong> Shipping charges will be calculated and shown at checkout.
  </p>
  <p className="mb-2">
    <strong>Flat rate shipping:</strong> We offer <strong>$0 flat rate shipping</strong> to [list countries].
  </p>
  <p className="mb-2">
    We offer <strong>free shipping</strong> for orders over $75.
  </p>

  {/* Shipping Options Table */}
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-300">
        <tr>
          <th className="border px-4 py-2 text-left">Shipping Option</th>
          <th className="border px-4 py-2 text-left">Estimated Delivery Time</th>
          <th className="border px-4 py-2 text-left">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">Option 1</td>
          <td className="border px-4 py-2">3 to 5 business days</td>
          <td className="border px-4 py-2">0</td>
        </tr>
        <tr>
          <td className="border px-4 py-2">Option 2</td>
          <td className="border px-4 py-2">3 to 5 business days</td>
          <td className="border px-4 py-2">0</td>
        </tr>
        <tr>
          <td className="border px-4 py-2">Option 3</td>
          <td className="border px-4 py-2">3 to 5 business days</td>
          <td className="border px-4 py-2">0</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

{/* Local Delivery */}
<section>
  <h3 className="text-xl font-semibold mb-2">Local Delivery</h3>
  <p className="mb-2">
    Free local delivery is available for orders over <strong>0</strong> within 10km. Orders under <strong>0</strong> will be charged <strong>0</strong> for delivery.
  </p>
  <p className="mb-2">
    Deliveries are made from 10hrs on 2 days . We will contact you via text using the phone number provided at checkout to notify you on the day of delivery.
  </p>
  <p className="mb-2">
    [Optional: List ZIP/postal codes or embed a delivery zone map here.]
  </p>
</section>

{/* In-Store Pickup */}
<section>
  <h3 className="text-xl font-semibold mb-2">In-Store Pickup</h3>
  <p className="mb-2">
   After placing your order and selecting local pickup at checkout, your order will be ready within <strong>3 to 5 business days</strong>. We will email you when it’s ready.
  </p>
  <p className="mb-2">
    Pickup hours are [store hours] on [available days]. Please bring your order confirmation email when you arrive.
  </p>
</section>

{/* International Shipping */}
<section>
  <h3 className="text-xl font-semibold mb-2">International Shipping</h3>
  <p className="mb-2">
    We currently ship to the following countries: [list of countries].
  </p>
  <p className="mb-2">
    At this time, we do not ship to: [list of countries].
  </p>
  <p className="mb-2">
    Shipping charges for international orders will be calculated and displayed at checkout.
  </p>

  {/* International Shipping Options Table */}
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-300">
        <tr>
          <th className="border px-4 py-2 text-left">Shipping Option</th>
          <th className="border px-4 py-2 text-left">Estimated Delivery Time</th>
          <th className="border px-4 py-2 text-left">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">Option 1</td>
          <td className="border px-4 py-2">3 to 5 business days</td>
          <td className="border px-4 py-2">0</td>
        </tr>
        <tr>
          <td className="border px-4 py-2">Option 2</td>
          <td className="border px-4 py-2">3 to 5 business days</td>
          <td className="border px-4 py-2">0</td>
        </tr>
        <tr>
          <td className="border px-4 py-2">Option 3</td>
          <td className="border px-4 py-2">3 to 5 business days</td>
          <td className="border px-4 py-2">0</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p className="mt-4">
    Your order may be subject to import duties and taxes (including VAT), which are applied once the shipment reaches your destination country. <strong>[Your Company]</strong> is not responsible for these charges—they are the customer's responsibility.
  </p>
</section>
</div>

    </div>
  )
}

export default ShippingPolicy