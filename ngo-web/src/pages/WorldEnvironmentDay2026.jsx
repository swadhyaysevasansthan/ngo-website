import { motion } from "framer-motion";
import {
  TreePine,
  PlayCircle,
  School,
  Building2,
  Users,
  Leaf,
  ArrowRight,
} from "lucide-react";

export default function WorldEnvironmentDay2026() {
  const galleryImages = [
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781275432/5be36ecc-4aad-4be7-ae0b-1363235b948e_j7gevm.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781273541/ba0b3c56-bf45-44bc-9543-2090695aeb4c_xtxwes.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781273590/32d0bea1-51b6-4202-b100-ea017d9d8ebb_jfqne6.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781275272/5dce8f4d-faa4-4909-8991-0d1f100e7936_mbkhh3.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781275059/54c85313-1210-4447-b8a0-d59d766e3c41_xpxrf3.jpg",
    "https://res.cloudinary.com/demp2xljz/image/upload/v1781273551/3999770d-6c7f-4356-9bb2-3f430b06ade5_pskpox.jpg",
  ];

  return (
    <main className="overflow-x-hidden bg-white">
      {/* HERO */}
      <section className="relative min-h-screen">
        <img
          src="https://res.cloudinary.com/demp2xljz/image/upload/v1781275366/9d3e1f2a-ef13-4cf3-b65e-a49552109b5d_c8gj3p.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl text-center"
          >
            <span className="inline-flex px-5 py-2 rounded-full bg-emerald-600 text-white text-sm">
              World Environment Day • 5 June 2026
            </span>

            <h1 className="mt-6 text-5xl md:text-7xl font-black text-white">
              Greening Communities
              <br />
              Inspiring Change
            </h1>

            <p className="mt-8 text-xl md:text-2xl text-white/90">
              Plantation Activities Across Educational Institutions,
              Communities, Workplaces and Homes
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#videos"
                className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold"
              >
                Watch DD Kisan Coverage
              </a>

              <a
                href="#gallery"
                className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold"
              >
                View Gallery
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DD KISAN */}
      <section
        id="videos"
        className="py-24 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-emerald-600 font-semibold uppercase tracking-wider">
              National Recognition
            </span>

            <h2 className="text-5xl font-black mt-4">
              Featured on DD Kisan's
              <br />
              Paryavaran Samvaad 2026
            </h2>

            <p className="max-w-3xl mx-auto mt-6 text-slate-600 text-lg leading-relaxed">
                As part of the World Environment Day Special programme
                "Paryavaran Samvaad 2026", Dr. Manish Goel represented
                Swadhyay Seva Foundation on DD Kisan and shared perspectives
                on environmental conservation, sustainable living, and the
                importance of community participation in protecting natural resources.

                The programme provided a valuable platform to discuss environmental
                challenges, promote awareness, and highlight the role of citizens,
                institutions, and organizations in building a greener and more
                sustainable future.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 mt-16">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/akQDzUbk0OA"
                title="DD Kisan Broadcast"
                allowFullScreen
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold">
                  Official DD Kisan Broadcast
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/KuTCYOjZKiA"
                title="SSF Coverage"
                allowFullScreen
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold">
                  SSF Highlights & Coverage
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-5xl font-black">
            Our World Environment Day Journey
          </h2>

          <div className="mt-20 space-y-12">
            {[
              {
                icon: School,
                title: "Delhi School of Social Work",
                text:
                  "Dr. Manish Goel and team visited the Delhi School of Social Work, University of Delhi and participated in plantation activities.",
              },
              {
                icon: TreePine,
                title: "Community Plantation Drive",
                text:
                  "The Founder, General Secretary and IT Head planted saplings in a nearby public park and local school.",
              },
              {
                icon: Building2,
                title: "Workplace Initiative",
                text:
                  "The President celebrated World Environment Day with colleagues through plantation activities at the workplace.",
              },
              {
                icon: Users,
                title: "Members Across Communities",
                text:
                  "Foundation members planted saplings near their homes and communities, contributing towards a greener future.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <item.icon className="text-emerald-700" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-slate-600 mt-3">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SECTIONS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
        {[
            {
                title: "Delhi School of Social Work, University of Delhi",
                icon: School,
                image:
                "https://res.cloudinary.com/demp2xljz/image/upload/v1781275366/9d3e1f2a-ef13-4cf3-b65e-a49552109b5d_c8gj3p.jpg",
                content: `On the occasion of World Environment Day 2026, Dr. Manish Goel, Founder of Swadhyay Seva Foundation, along with the Foundation's IT Head, visited the Delhi School of Social Work, University of Delhi to participate in plantation activities promoting environmental awareness and sustainability.

            During the visit, they had the opportunity to meet Prof. Neena Pandey, Head of the Department, and discuss the importance of environmental responsibility, youth engagement, and community participation in creating a greener future. The plantation activity reflected a shared commitment towards nurturing environmentally conscious institutions and inspiring positive action among students and educators.`,
            },

            {
                title: "Community Plantation Initiative",
                icon: TreePine,
                image:
                "https://res.cloudinary.com/demp2xljz/image/upload/v1781273535/6df1ca79-f827-4d27-a903-b3d7eb9c6914_ryowxk.jpg",
                content: `Extending the celebration beyond institutional spaces, Dr. Manish Goel, the General Secretary, and the Foundation's IT Head participated in plantation activities at a nearby public park and a local school.

            Through these activities, the Foundation sought to encourage community participation in environmental conservation and demonstrate how collective efforts can contribute towards healthier and greener public spaces. The initiative served as a reminder that meaningful change often begins with simple actions taken within our own communities.`,
            },

            {
                title: "Workplace Environmental Action",
                icon: Building2,
                image:
                "https://res.cloudinary.com/demp2xljz/image/upload/v1781273594/dbdd3036-ce7d-457b-a298-74a3ff8195bd_x8pkmp.jpg",
                content: `The President of Swadhyay Seva Foundation joined colleagues at the workplace to celebrate World Environment Day through a plantation initiative conducted within the office premises.

            The activity highlighted the importance of integrating environmental responsibility into professional environments and demonstrated how workplaces can contribute to sustainability through collective action. By planting saplings together, participants reinforced their commitment towards creating greener and healthier surroundings for future generations.`,
            },

            {
                title: "Members Across Communities",
                icon: Users,
                image:
                "https://res.cloudinary.com/demp2xljz/image/upload/v1781274994/c18c29c8-ea99-47bf-a0ac-a6a476958af4_i4bxoq.jpg",
                content: `Members of Swadhyay Seva Foundation from different locations actively participated in the initiative by planting saplings near their homes and within their local communities.

            These individual contributions reflected the Foundation's belief that environmental conservation is a shared responsibility. Through their efforts, members demonstrated that every action, no matter how small, plays an important role in protecting nature and building a more sustainable future.`,
            },
            ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <img
                src={section.image}
                alt={section.title}
                className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
                />

              <div>
                <section.icon className="text-emerald-600 mb-4" size={32} />

                <h2 className="text-4xl font-black">{section.title}</h2>

                <p className="mt-6 text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-5xl font-black">
            Photo Gallery
          </h2>

          <p className="text-center text-slate-600 mt-4">
            Moments from plantation drives, community engagement,
            educational institutions, workplaces and homes.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, y: -8 }}
                className="overflow-hidden rounded-3xl shadow-xl"
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-80 object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-28 bg-emerald-700 text-white">
        <div className="max-w-5xl mx-auto text-center px-6">
          <Leaf size={48} className="mx-auto mb-6" />

          <h2 className="text-5xl font-black">
            Our Commitment To
            <br />
            A Greener Future
          </h2>

          <p className="mt-8 text-xl leading-relaxed text-white/90">
            Environmental conservation is not limited to a single day of observance.
            It is a continuous responsibility that requires awareness, action,
            and collective participation.

            Through this World Environment Day initiative, Swadhyay Seva Foundation
            reaffirmed its commitment to sustainability, environmental education,
            and community-driven efforts that contribute towards a healthier and
            greener future. We believe that meaningful change begins with individual
            actions and grows through collective responsibility.
            </p>
        </div>
      </section>

      {/* FINAL BANNER */}
      <section className="relative min-h-[70vh]">
        <img
          src="https://res.cloudinary.com/demp2xljz/image/upload/v1781275560/d3804657-fb4f-471d-a983-68804b4d10c1_pj0rm5.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-5xl md:text-7xl font-black text-white">
              Together We Plant Today,
              <br />
              For A Better Tomorrow
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}