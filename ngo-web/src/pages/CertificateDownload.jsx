// src/pages/CertificateDownload.jsx
import React, { useState, useMemo } from 'react';
import { Award, Download, Search } from 'lucide-react';

const CertificateDownload = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock certificate data - replace with your backend API data
  const certificatesData = [
    {
      id: 1,
      name: 'Rahul Sharma',
      phone: '9876543210',
      school: 'Mayoor School, Noida',
      event: 'SNEAC 2025',
      date: 'December 5, 2025',
      certificateUrl: '/question-banks/paper 2 for 7-9th.pdf'
    },
    {
      id: 2,
      name: 'Priya Singh',
      phone: '9876543211',
      school: 'Vidya Bharati School',
      event: 'SNEAC 2025',
      date: 'December 10, 2025',
      certificateUrl: '/certificates/SNEAC2025002.pdf'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      phone: '9876543212',
      school: 'Gita Girls Senior Secondary School',
      event: 'SNEAC 2025',
      date: 'December 11, 2025',
      certificateUrl: '/certificates/SNEAC2025003.pdf'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      phone: '9876543213',
      school: 'Prince Public School',
      event: 'SNEAC 2025',
      date: 'December 11, 2025',
      certificateUrl: '/certificates/SNEAC2025004.pdf'
    },
    {
      id: 5,
      name: 'Arjun Verma',
      phone: '9876543214',
      school: 'Delhi Heritage School',
      event: 'SNEAC 2025',
      date: 'December 16, 2025',
      certificateUrl: '/certificates/SNEAC2025005.pdf'
    }
  ];

  // Filter certificates based on search term
  const filteredCertificates = useMemo(() => {
    if (!searchTerm) return certificatesData;
    
    const search = searchTerm.toLowerCase();
    return certificatesData.filter(cert => 
      cert.name.toLowerCase().includes(search) || 
      cert.phone.includes(searchTerm)
    );
  }, [searchTerm]);

const handleDownload = (url, name) => {
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = `Certificate_${name.replace(/\s+/g, '_')}.pdf`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <Award className="text-emerald-600" size={40} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Download Your Certificate
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search by your name or phone number to find and download your 
            environmental awareness quiz participation certificate.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or phone number..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-lg"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-3">
              Found {filteredCertificates.length} certificate(s)
            </p>
          )}
        </div>

        {/* Certificates Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Participant Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Event Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    Certificate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert, index) => (
                    <tr 
                      key={cert.id} 
                      className="hover:bg-emerald-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {cert.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.school}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {cert.date}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDownload(cert.certificateUrl, cert.name)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No certificates found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you cannot find your certificate or need assistance, please contact us at:
          </p>
          <a
            href="mailto:swadhyaysevafoundation@gmail.com"
            className="text-emerald-600 font-bold hover:underline text-lg"
          >
            swadhyaysevafoundation@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
};

export default CertificateDownload;
