"use client";
import React from 'react';
import ContactForm from './_components/ContactForm';

function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <ContactForm />
      </div>
    </div>
  );
}

export default ContactUsPage;