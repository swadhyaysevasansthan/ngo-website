import { ShieldCheckIcon, ArrowsRightLeftIcon, ScaleIcon } from "@heroicons/react/24/outline";

const icons = {
  privacy: ShieldCheckIcon,
  refund: ArrowsRightLeftIcon,
  terms: ScaleIcon,
};


const PolicyHero = ({ type = "privacy", title, subtitle }) => {
  const Icon = icons[type] || ShieldCheckIcon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-saffron-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 border border-white/30 backdrop-blur-sm">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          {title}
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-white/90">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default PolicyHero;
