import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Updated FloatingElement component for smooth animation
const FloatingElement = ({ children, yOffset = 20, duration = 3 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, yOffset]);

  return (
    <motion.div
      style={{ y }}
      animate={{ y: [0, yOffset, 0] }}
      transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

// Footer component
const Footer = () => {
  // Link data for each footer column
  const footerData = [
    {
      title: 'Product',
      links: [
        { name: 'Features', url: '/' },
        { name: 'Pricing', url: '/pricing' },
        { name: 'Case Studies', url: '/blogs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', url: '/' },
        { name: 'Contact', url: '/contactus' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', url: '/privacypolicy' },
        { name: 'Terms of Service', url: '/termsandconditions' },
       
      ],
    },
  ];

  return (
    <footer className="py-20 bg-black text-white relative overflow-hidden">
      {/* Floating elements */}
      <FloatingElement yOffset={30} duration={5}>
        <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full opacity-10" />
      </FloatingElement>
      <FloatingElement yOffset={-20} duration={4}>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full opacity-10" />
      </FloatingElement>

      {/* Footer content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-green-500">
          <div>
            <h3 className="text-2xl font-gliker mb-4">Nuren AI</h3>
            <p className="text-white">
              Revolutionizing WhatsApp business communication with AI-powered solutions.
            </p>
          </div>
          {footerData.map((column, index) => (
            <div key={index}>
              <h4 className="text-xl font-gliker mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url} // Use actual URL here
                      className="text-white hover:text-green-400 transition duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-white font-gliker">
          <p>&copy; 2024 Nu Renaissance Fabrica Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
