import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Camera,
  Users,
  Trophy,
  Trees,
  Landmark,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";

export default function WetlandsDay() {
  const galleryImages = [
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006270/b1b9bc5f-043c-43bc-93d6-7e26b2e1d4e3_la8zt7.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006284/3b807194-042f-48f3-89ee-9424ea118e16_uqohgu.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006309/37287a5e-cf67-42a4-b54a-7d8843aeaedc_ywslta.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006485/96332fa3-fa95-41b5-9661-aea2cb40d2e3_mwizmq.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006487/1577979e-a08e-4be4-ac16-916ceb8e0caf_lhzjg7.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006500/5c3a541f-ea46-42bd-8490-77f4bf4a42b6_ike7vm.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006538/d2616cfc-3821-4a95-a92b-cd238eb4b10f_qnphqn.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006523/2b500689-173f-4848-aa72-518b109ee625_vksz19.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781006517/591c4ab3-c4be-4a08-9015-b88a6e9aebb2_botys6.jpg",
  ];

  return (
    <main className="overflow-x-hidden bg-white">
      <section className="relative min-h-screen">
        <img
            src="https://res.cloudinary.com/demp2xljz/image/upload/v1781006284/3b807194-042f-48f3-89ee-9424ea118e16_uqohgu.jpg"
            className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

            <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl text-center"
            >

            <span className="inline-flex px-5 py-2 rounded-full bg-emerald-500 text-white text-sm">
                World Wetlands Day • 2 February 2026
            </span>

            <h1 className="mt-6 text-6xl md:text-8xl font-black text-white">
                Photography
                <br />
                Competition 2026
            </h1>

            <p className="mt-8 text-xl md:text-2xl text-white/90">
                Wetlands and Traditional Knowledge:
                Celebrating Cultural Heritage
            </p>

            </motion.div>
        </div>
        </section>

        <section className="py-24 bg-slate-50">

            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">

                {[
                {
                    icon: Users,
                    value: 90,
                    suffix: "+",
                    label: "Registrations"
                },

                {
                    icon: Camera,
                    value: 40,
                    label: "Submissions"
                },

                {
                    icon: Trophy,
                    value: 150,
                    suffix: "+",
                    label: "Audience"
                },

                {
                    icon: Trees,
                    value: 3,
                    label: "Organizers"
                }

                ].map((item) => (
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

                    <item.icon className="mx-auto mb-5" />

                    <div className="text-5xl font-black text-emerald-600">
                    <CountUp end={item.value} />
                    {item.suffix}
                    </div>

                    <p>{item.label}</p>

                </div>
                ))}
            </div>
            </section>

            <section className="py-24">

                <div className="max-w-6xl mx-auto px-6">

                    <h2 className="text-5xl font-bold">
                    About The Event
                    </h2>

                    <p className="mt-8 text-lg leading-relaxed text-slate-600">
                    On the occasion of World Wetlands Day 2026,
                    a Photography Competition was jointly organized
                    by DDA Yamuna Biodiversity Park,
                    Rajdhani College (University of Delhi),
                    and Swadhyay Seva Foundation.
                    </p>

                    <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    The competition encouraged students to
                    document wetland ecosystems, biodiversity,
                    cultural heritage, and traditional knowledge
                    through visual storytelling.
                    </p>

                </div>
                </section>
            <section className="py-20 bg-slate-50">

                <h2 className="text-center text-4xl font-bold">
                    Jointly Organized By
                </h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16 px-6">

                    <div className="p-10 rounded-3xl bg-white shadow-lg">
                    DDA Yamuna Biodiversity Park
                    </div>

                    <div className="p-10 rounded-3xl bg-white shadow-lg">
                    Rajdhani College (University of Delhi)
                    </div>

                    <div className="p-10 rounded-3xl bg-white shadow-lg">
                    Swadhyay Seva Foundation
                    </div>

                </div>
            </section>

            <section className="py-24">

                <h2 className="text-center text-5xl font-bold">
                    Event Journey
                </h2>

                <div className="max-w-4xl mx-auto mt-20">

                    {[
                    {
                        date: "23 Jan 2026",
                        title: "Competition Begins"
                    },

                    {
                        date: "29 Jan 2026",
                        title: "Submission Deadline"
                    },

                    {
                        date: "2 Feb 2026",
                        title: "Awards Ceremony"
                    }
                    ].map((item) => (

                    <div className="flex gap-6 mb-16">

                        <div className="w-5 h-5 rounded-full bg-emerald-500 mt-2" />

                        <div>

                        <div className="text-emerald-600 font-semibold">
                            {item.date}
                        </div>

                        <h3 className="text-2xl font-bold">
                            {item.title}
                        </h3>

                        </div>

                    </div>
                    ))}

                </div>
            
            </section>

            <section className="py-24 bg-slate-50">

                <h2 className="text-center text-5xl font-bold mb-20">
                    Event Gallery
                </h2>

                <div className="columns-1 md:columns-3 gap-4 px-6 max-w-7xl mx-auto">

                    {galleryImages.map((image) => (

                    <img
                        key={image}
                        src={image}
                        className="mb-4 rounded-3xl hover:scale-105 transition duration-500"
                    />

                    ))}

                </div>

            </section>

            <section className="py-24">

                <h2 className="text-center text-5xl font-bold">
                    Awards & Recognition
                </h2>

                <div className="grid md:grid-cols-4 gap-8 mt-16 max-w-7xl mx-auto px-6">

                    <div className="rounded-3xl p-8 shadow-xl">
                    🥇 ₹2,000
                    <br />
                    First Prize
                    </div>

                    <div className="rounded-3xl p-8 shadow-xl">
                    🥈 ₹1,500
                    <br />
                    Second Prize
                    </div>

                    <div className="rounded-3xl p-8 shadow-xl">
                    🥉 ₹1,000
                    <br />
                    Third Prize
                    </div>

                    <div className="rounded-3xl p-8 shadow-xl">
                    🏅 5 Consolation Awards
                    </div>

                </div>
            </section>

            <section className="py-28 bg-emerald-700 text-white">

                <div className="max-w-5xl mx-auto text-center px-6">

                    <h2 className="text-5xl font-bold">
                    Impact & Outcomes
                    </h2>

                    <p className="mt-8 text-xl leading-relaxed">

                    The competition successfully engaged
                    youth in understanding wetlands as
                    vital ecological resources and
                    repositories of traditional knowledge.

                    </p>

                    <p className="mt-6 text-xl leading-relaxed">

                    Through visual storytelling,
                    participants highlighted biodiversity,
                    conservation, cultural heritage,
                    and the relationship between
                    communities and nature.

                    </p>

                </div>
            </section>

            <section className="relative min-h-[70vh]">

                <img
                    src="https://res.cloudinary.com/demp2xljz/image/upload/v1781006517/591c4ab3-c4be-4a08-9015-b88a6e9aebb2_botys6.jpg"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/70" />

                <div className="relative z-10 flex items-center justify-center min-h-[70vh]">

                    <div className="text-center px-6">

                    <h2 className="text-6xl font-black text-white">
                        Protect Wetlands.
                        <br />
                        Preserve Heritage.
                    </h2>

                    <p className="text-white/80 mt-8 text-xl">
                        Inspiring the next generation through conservation.
                    </p>

                    </div>

                </div>
                </section>
    </main>
  );
}