import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { farmerAPI } from '../../utils/api';
import FarmerForm from './FarmerForm';
import FarmerCategoriesPanel from './FarmerCategoriesPanel';

const emptyFarmer = {
  name: '',
  slug: '',
  designation: '',
  location: '',
  short_bio: '',
  detailed_bio: '',

  profile_image: '',
  cover_image: '',

  phone: '',
  email: '',
  website: '',
  instagram: '',
  facebook: '',
  address: '',

  categories: [],
  products: [],
  achievements: [],
  gallery: [],

  is_featured: false,
  is_active: true,
};

const FarmersAdminTab = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFarmer, setSelectedFarmer] =
    useState(null);

  const [search, setSearch] = useState('');

  const [view, setView] =
    useState('farmers');

  const loadFarmers = async () => {
    try {
      const res =
        await farmerAPI.adminGetAll();

      setFarmers(res.data.data || []);
    } catch (error) {
      toast.error(
        'Failed to load farmers'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const handleCreateNew = () => {
    setSelectedFarmer({
      ...emptyFarmer,
    });
  };

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await farmerAPI.update(
          formData.id,
          formData
        );

        toast.success(
          'Farmer updated'
        );
      } else {
        await farmerAPI.create(
          formData
        );

        toast.success(
          'Farmer created'
        );
      }

      await loadFarmers();

      setSelectedFarmer(null);
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          'Failed to save farmer'
      );
    }
  };

  const handleDelete = async (
    farmerId
  ) => {
    if (
      !window.confirm(
        'Delete this farmer?'
      )
    ) {
      return;
    }

    try {
      await farmerAPI.delete(
        farmerId
      );

      toast.success(
        'Farmer deleted'
      );

      await loadFarmers();

      setSelectedFarmer(null);
    } catch (error) {
      toast.error(
        'Failed to delete farmer'
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        Loading farmers...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* TOP SWITCH */}

      <div className="bg-white rounded-xl border overflow-hidden flex">

        <button
          onClick={() =>
            setView('farmers')
          }
          className={`flex-1 py-3 font-medium transition-all ${
            view === 'farmers'
              ? 'bg-primary text-white'
              : 'bg-white'
          }`}
        >
          👨‍🌾 Farmers
        </button>

        <button
          onClick={() =>
            setView('categories')
          }
          className={`flex-1 py-3 font-medium transition-all ${
            view === 'categories'
              ? 'bg-primary text-white'
              : 'bg-white'
          }`}
        >
          🏷️ Categories
        </button>

      </div>

      {/* CATEGORY MANAGEMENT */}

      {view === 'categories' ? (
        <FarmerCategoriesPanel />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT PANEL */}

          <div className="bg-white rounded-2xl shadow-md p-5">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                👨‍🌾 Farmers
              </h2>

              <button
                onClick={
                  handleCreateNew
                }
                className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                + Add
              </button>
            </div>

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search farmers..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="space-y-3">

              {farmers
                .filter((farmer) =>
                  farmer.name
                    ?.toLowerCase()
                    .includes(
                      search.toLowerCase()
                    )
                )
                .map((farmer) => (
                  <div
                    key={
                      farmer.id
                    }
                    onClick={() =>
                      setSelectedFarmer(
                        farmer
                      )
                    }
                    className={`border rounded-xl p-3 cursor-pointer transition-all ${
                      selectedFarmer?.id ===
                      farmer.id
                        ? 'border-primary bg-orange-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">

                      <div>
                        <div className="font-semibold">
                          {
                            farmer.name
                          }
                        </div>

                        <div className="text-sm text-gray-500">
                          {
                            farmer.location
                          }
                        </div>
                      </div>

                      {farmer.is_featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}

              {!farmers.filter(
                (farmer) =>
                  farmer.name
                    ?.toLowerCase()
                    .includes(
                      search.toLowerCase()
                    )
              ).length && (
                <div className="text-gray-400 text-sm">
                  No farmers found.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="lg:col-span-2">

            {selectedFarmer ? (
              <FarmerForm
                farmer={
                  selectedFarmer
                }
                onSave={
                  handleSave
                }
                onDelete={
                  handleDelete
                }
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
                Select a farmer or create a
                new one.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default FarmersAdminTab;