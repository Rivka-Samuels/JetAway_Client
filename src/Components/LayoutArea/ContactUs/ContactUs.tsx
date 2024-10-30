import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h2>Get in Touch</h2>
        <p>
          We’re here to assist you with any inquiries. Please feel free to reach out!
        </p>
      </div>
      
      <div className="contact-details">
        <div className="contact-card">
          <h3>Contact Information</h3>
          <ul>
            <li><strong>Name:</strong> Rivka Samuels</li>
            <li><strong>Email:</strong> <a href="mailto:rmeks10@gmail.com">rmeks10@gmail.com</a></li>
          </ul>
        </div>
      </div>
      
      <div className="contact-message">
        <p>
          We look forward to hearing from you and will respond to your inquiry as soon as possible. Your satisfaction is our priority, and we are always available to assist with any questions or requests.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
