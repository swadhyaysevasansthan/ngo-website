import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import Lightbox from "yet-another-react-lightbox";
import {
    ArrowLeft,
} from 'lucide-react';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "yet-another-react-lightbox/styles.css";

import { useParams, Link } from "react-router-dom";
import { teamMembers } from "../data/teamData";
import { useEffect, useState } from "react";

const TeacherProfile = () => {
    const { slug } = useParams();

    const teacher = teamMembers.find(
        (member) => member.page && member.slug === slug
    );

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (teacher) {
            document.title = `${teacher.name} | Swadhyay Seva Foundation`;
        } else {
            document.title = "Teacher Not Found";
        }
    }, [teacher]);

    if (!teacher) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Teacher Not Found
                    </h1>

                    <p className="text-gray-600 mb-8">
                        The requested teacher profile does not exist.
                    </p>

                    <Link
                        to="/ourteam"
                        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        ← Back to Our Team
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Hero Section */}
            <section
                className={`relative text-white py-6 ${teacher.coverImage
                    ? "bg-cover bg-center"
                    : "bg-gradient-to-r from-primary-600 to-green-600"
                    }`}
                style={
                    teacher.coverImage
                        ? {
                            backgroundImage: `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${teacher.coverImage})`,
                        }
                        : {}
                }
            >
                <div className="max-w-6xl mx-auto px-4">
                    <Link
                        to="/ourteam"
                        className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg text-black"
                    >
                        <ArrowLeft size={18} />
                        Back to Our Team
                    </Link>
                    <div className="text-center">
                        <div className="w-44 h-44 rounded-full overflow-hidden mx-auto border-4 border-white shadow-xl">
                            <img
                                src={teacher.image}
                                alt={teacher.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mt-6">
                            {teacher.name}
                        </h1>

                        {teacher.role && (
                            <p className="text-xl mt-3 text-green-100">
                                {teacher.role}
                            </p>
                        )}

                        {teacher.description && (
                            <p className="max-w-3xl mx-auto mt-6 text-lg text-white/90">
                                {teacher.description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-14">
                <div className="max-w-5xl mx-auto px-4">

                    {/* About */}
                    <div className="bg-white rounded-2xl shadow-md p-8">

                        <h2 className="text-3xl font-bold text-gray-800 mb-8">
                            About
                        </h2>

                        <div className="prose prose-gray max-w-none">
                            {teacher.details}
                        </div>

                    </div>

                    {/* Gallery */}
                    {teacher.gallery?.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-md p-8 mt-10">

                            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                                Gallery
                            </h2>

                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={20}
                                navigation
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                autoplay={{
                                    delay: 2500,
                                    pauseOnMouseEnter: true,
                                    disableOnInteraction: false,
                                }}
                                speed={700}
                                loop
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    640: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                }}
                            >
                                {teacher.gallery.map((image, i) => (
                                    <SwiperSlide key={i}>
                                        <div
                                            className="group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                                            onClick={() => {
                                                setIndex(i);
                                                setOpen(true);
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`${teacher.name} ${i + 1}`}
                                                className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                        </div>
                    )}

                </div>
            </section>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={teacher.gallery.map((img) => ({ src: img }))}
                controller={{
                    closeOnBackdropClick: true,
                    closeOnPullDown: true,
                }}
            />

        </div>
    );
};

export default TeacherProfile;