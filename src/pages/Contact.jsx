import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Our Address",
      content: "first floor, B-3/2, Sector 16, Rohini, Delhi, 110089",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Number",
      content: "+91 95992 24323",
      link: "tel:+9195992 24323",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      content: "swadhyaysevasansthan@gmail.com",
      link: "mailto:swadhyaysevasansthan@gmail.com",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Have questions or want to get involved? We'd love to hear from you. 
              Reach out and let's make a difference together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info and Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Contact Info Cards Stacked Vertically */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} delay={index * 0.1}>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-saffron-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-600 hover:text-primary-600 transition-colors text-sm"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 text-sm">{info.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Office Hours Card */}
            <Card delay={0.3}>
              <div className="p-6 bg-gradient-to-br from-primary-50 to-saffron-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Office Hours</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Monday - Saturday:</strong> 9:00 AM - 6:00 PM
                </p>
                <p className="text-sm text-gray-600">
                  Feel free to visit us or schedule an appointment for detailed discussions 
                  about our programs and initiatives.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Side - Map */}
          <Card delay={0.2}>
            <div className="p-8 h-full">
              <SectionHeader
                title="Find Us Here"
                subtitle="Visit our location in Delhi"
                centered={false}
              />
              <div className="rounded-lg overflow-hidden shadow-lg" style={{ height: 'calc(100% - 120px)', minHeight: '400px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.3592469351793!2d77.12842447496064!3d28.73868917925311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d01c90af497bd%3A0x96ee0f1a815c8e4c!2sSwadhyay%20Health%20Care!5e0!3m2!1sen!2sin!4v1760185621415!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Swadhyay Seva Sansthan Location"
                ></iframe>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Whether you're interested in volunteering, partnering, or simply learning more 
              about our work, we welcome your involvement.
            </p>
            <p className="text-blue-100">
              Together, we can create a healthier, more sustainable future for all.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

