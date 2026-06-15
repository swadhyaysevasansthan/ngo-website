import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmerAPI } from '../utils/api';
import FeaturedFarmerCard from './farmers/FeaturedFarmerCard';

const FeaturedFarmers = () => {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const res = await farmerAPI.getAll();

      const featured =
        (res.data.data || [])
          .filter(
            (farmer) => farmer.is_featured
          )
          .slice(0, 3);

      setFarmers(featured);
    } catch (error) {
      console.error(error);
    }
  };

  if (!farmers.length) return null;

  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between mb-10">

          <div>
            <h2 className="text-4xl font-bold">
              Our Innovative Farmers
            </h2>

            <p className="text-gray-600 mt-2">
              Farmers creating sustainable impact through innovation.
            </p>
          </div>

          <Link
            to="/innovative-farmers"
            className="bg-primary text-white px-5 py-3 rounded-xl"
          >
            View All
          </Link>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {farmers.map((farmer) => (
            <FeaturedFarmerCard
              key={farmer.id}
              farmer={farmer}
            />
          ))}

        </div>

      </div>

    </section>
  );
};

export default FeaturedFarmers;