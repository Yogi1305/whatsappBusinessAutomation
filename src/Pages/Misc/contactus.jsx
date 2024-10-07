import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <div className="text-lg space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Address</h2>
            <p>44 Backary Portion, 2nd Floor, Regal Building, New Delhi - 110 001</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Phone</h2>
            <p>+1 (619) 456-0588</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Email</h2>
            <p>founder@nuren.ai</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Working Hours</h2>
            <p>Mon - Saturday: 9 AM - 9 PM (IST)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
