import React, { useEffect, useState } from 'react';
import {
  useParams,
  Link,
} from 'react-router-dom';

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  ArrowLeft,
  Award,
  Package,
} from 'lucide-react';

import { farmerAPI } from '../utils/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const FarmerProfile = () => {
  const { slug } = useParams();

  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] =
    useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadFarmer();
  }, [slug]);

  useEffect(() => {
    if (farmer) {
      document.title = `${farmer.name} | Swadhyay Seva Foundation`;
    }

    return () => {
      document.title =
        'Swadhyay Seva Foundation';
    };
  }, [farmer]);

  const loadFarmer = async () => {
    try {
      const res =
        await farmerAPI.getBySlug(slug);

      setFarmer(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading farmer profile...
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">
          Farmer Not Found
        </h2>

        <Link
          to="/innovative-farmers"
          className="text-primary"
        >
          Back to Farmers
        </Link>
      </div>
    );
  }

  return (
    <div>

      {/* HERO */}

      <section className="relative">

        {farmer.cover_image ? (
          <div
            className="h-[350px] md:h-[450px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${farmer.cover_image})`,
            }}
          />
        ) : (
          <div className="h-[350px] md:h-[450px] bg-gradient-to-r from-primary-600 to-saffron-600" />
        )}

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute top-6 left-6">
          <Link
            to="/innovative-farmers"
            className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>

      </section>

      {/* PROFILE */}

      <section className="max-w-7xl mx-auto px-4">

        <div className="relative -mt-24 z-10">

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex flex-col md:flex-row gap-8">

              <div>

                <img
                  src={farmer.profile_image || '/images/team/user.png'}
                  alt={farmer.name}
                  className="w-40 h-40 rounded-2xl object-cover shadow-lg"
                />

              </div>

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3 mb-3">

                  <h1 className="text-4xl font-bold">
                    {farmer.name}
                  </h1>

                  {farmer.is_featured && (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ Featured Farmer
                    </span>
                  )}

                </div>

                {farmer.designation && (
                  <p className="text-xl text-primary font-medium mb-3">
                    {farmer.designation}
                  </p>
                )}

                {farmer.location && (
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <MapPin size={18} />
                    {farmer.location}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">

                  {(farmer.categories || []).map(
                    (category) => (
                      <span
                        key={category}
                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ABOUT */}

      {(farmer.detailed_bio ||
        farmer.short_bio) && (
          <section className="max-w-7xl mx-auto px-4 py-16">

            <h2 className="text-3xl font-bold mb-6">
              About
            </h2>

            <div className="bg-white rounded-2xl shadow-md p-8">
              <p className="text-gray-700 leading-8 whitespace-pre-line">
                {farmer.detailed_bio ||
                  farmer.short_bio}
              </p>
            </div>

          </section>
        )}

      {/* ACHIEVEMENTS */}

      {farmer.achievements?.length >
        0 && (
          <section className="max-w-7xl mx-auto px-4 pb-16">

            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Award />
              Achievements
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {farmer.achievements.map(
                (
                  achievement,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md p-6"
                  >
                    {achievement}
                  </div>
                )
              )}

            </div>

          </section>
        )}

      {/* PRODUCTS */}

      {farmer.products?.length >
        0 && (
          <section className="max-w-7xl mx-auto px-4 pb-16">

            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Package />
              Products & Services
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {farmer.products.map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md p-6"
                  >
                    {product}
                  </div>
                )
              )}

            </div>

          </section>
        )}

      {/* GALLERY */}

      {farmer.gallery?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">

          <h2 className="text-3xl font-bold mb-8">
            Gallery
          </h2>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {farmer.gallery.map(
              (image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image.url}
                    alt=""
                    onClick={() =>
                      setSelectedImage(image.url)
                    }
                    className="w-full h-80 object-cover rounded-2xl cursor-pointer"
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>

        </section>
      )}

      {/* CONTACT */}

      {(farmer.phone ||
        farmer.email ||
        farmer.website ||
        farmer.address ||
        farmer.facebook ||
        farmer.instagram) && (
          <section className="max-w-7xl mx-auto px-4 pb-24">

            <h2 className="text-3xl font-bold mb-8">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {farmer.phone && (
                <div className="bg-white rounded-2xl shadow-md p-5 flex gap-3">
                  <Phone />
                  {farmer.phone}
                </div>
              )}

              {farmer.email && (
                <div className="bg-white rounded-2xl shadow-md p-5 flex gap-3">
                  <Mail />
                  {farmer.email}
                </div>
              )}

              {farmer.website && (
                <a
                  href={farmer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white rounded-2xl shadow-md p-5 flex gap-3"
                >
                  <Globe />
                  Website
                </a>
              )}

              {farmer.instagram && (
                <a
                  href={farmer.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white rounded-2xl shadow-md p-5 flex gap-3"
                >
                  <Instagram />
                  Instagram
                </a>
              )}

              {farmer.facebook && (
                <a
                  href={farmer.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white rounded-2xl shadow-md p-5 flex gap-3"
                >
                  <Facebook />
                  Facebook
                </a>
              )}

              {farmer.address && (
                <div className="bg-white rounded-2xl shadow-md p-5 flex gap-3">
                  <MapPin />
                  {farmer.address}
                </div>
              )}

            </div>

          </section>
        )}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          />

          <button
            className="absolute top-5 right-5 text-white text-4xl"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
};

export default FarmerProfile;