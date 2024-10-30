import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-hero-content">
                <img src="https://rivkabucket.s3.amazonaws.com/JetAway/JetAwayLogoH.png" alt="JetAway Logo" className="about-hero-logo" />
                <p>
                    Welcome to <strong className="highlight">JetAway</strong>, where luxury travel meets personalized service. We specialize in crafting unforgettable vacations tailored to the unique desires and preferences of each of our clients. Whether you’re dreaming of an exotic island escape, a cultural adventure, or a relaxing retreat, <strong className="highlight">JetAway</strong> is here to make it happen with style, comfort, and attention to every detail.
                </p>
                <p>
                    At <strong className="highlight">JetAway</strong>, we believe that every journey should be as extraordinary as the destination itself. From the moment you contact us, our team of travel experts takes care of everything—curating exclusive itineraries, securing world-class accommodations, and ensuring that you experience the very best of each destination. We partner with renowned hotels, resorts, and private villas to offer you unparalleled luxury, and our access to private jets and yachts means that your travel experience is always first-class.
                </p>
                <p>
                    What sets <strong className="highlight">JetAway</strong> apart is our commitment to personalization. No two travelers are alike, and we pride ourselves on creating tailor-made experiences that reflect your individual tastes. Whether you’re seeking adventure, relaxation, or a bit of both, our team is dedicated to designing the perfect getaway just for you. With <strong className="highlight">JetAway</strong>, your vacation is not just a trip—it’s an experience designed to inspire, rejuvenate, and create lasting memories.
                </p>
                <h3>Our Promise</h3>
                <p>
                    At <strong className="highlight">JetAway</strong>, we are passionate about providing more than just travel services—we offer experiences that exceed expectations. Our dedication to excellence ensures that every aspect of your journey, from planning to execution, is handled with the utmost care and professionalism. Your satisfaction is our priority, and we strive to make every vacation an extraordinary one.
                </p>
                <p>
                    Thank you for choosing <strong className="highlight">JetAway</strong>. We look forward to helping you discover the world in luxury.
                </p>
            </div>
        </div>
    );
};

export default About;
