import React, { useEffect, useMemo, useState } from 'react';
import FarmerCard from '../components/farmers/FarmerCard';
import { farmerAPI } from '../utils/api';

const InnovativeFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    document.title =
      'Our Innovative Farmers | Swadhyay Seva Foundation';

    return () => {
      document.title =
        'Swadhyay Seva Foundation';
    };
  }, []);

  const loadData = async () => {
    try {
      const [farmersRes, categoriesRes] =
        await Promise.all([
          farmerAPI.getAll(),
          farmerAPI.getCategories(),
        ]);

      setFarmers(
        farmersRes.data.data || []
      );

      setCategories(
        categoriesRes.data.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const searchMatch =
        farmer.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        farmer.location
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const categoryMatch =
        selectedCategory === 'All'
          ? true
          : farmer.categories?.includes(
            selectedCategory
          );

      return searchMatch && categoryMatch;
    });
  }, [
    farmers,
    search,
    selectedCategory,
  ]);

  const featuredFarmers =
    filteredFarmers.filter(
      (farmer) => farmer.is_featured
    );

  return (
    <div>

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-24">

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Innovative Farmers
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-green-50">
            Celebrating farmers who are
            transforming agriculture through
            innovation, sustainability and
            community leadership.
          </p>

        </div>
      </section>

      {/* FILTERS */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <input
          type="text"
          placeholder="Search farmers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl px-4 py-3 mb-6"
        />

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              setSelectedCategory('All')
            }
            className={`px-4 py-2 rounded-full ${selectedCategory === 'All'
                ? 'bg-primary text-white'
                : 'bg-gray-100'
              }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  category.name
                )
              }
              className={`px-4 py-2 rounded-full ${selectedCategory ===
                  category.name
                  ? 'bg-primary text-white'
                  : 'bg-gray-100'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

      </section>

      {/* FEATURED */}
      {/* 
      {featuredFarmers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">

          <h2 className="text-3xl font-bold mb-8">
            ⭐ Featured Farmers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFarmers.map(
              (farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                />
              )
            )}
          </div>

        </section>
      )} */}

      {/* ALL FARMERS */}

      <section className="max-w-7xl mx-auto px-4 pb-20">

        <h2 className="text-3xl font-bold mb-8">
          All Farmers
        </h2>

        {loading ? (
          <div className="text-center py-12">
            Loading...
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-700">
              No farmers found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFarmers.map((farmer) => (
              <FarmerCard
                key={farmer.id}
                farmer={farmer}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default InnovativeFarmers;