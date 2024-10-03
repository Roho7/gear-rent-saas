import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BiCalendar, BiChart, BiGlobe, BiHeadphone } from "react-icons/bi";

interface BusinessFeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const BusinessFeatureCard: React.FC<BusinessFeatureProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <Card className="glass-dark text-white">
    <CardHeader>
      <Icon className="w-8 h-8 mb-2" />
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-300">{description}</p>
      <Button variant="link" className="text-white mt-2 p-0">
        Learn more →
      </Button>
    </CardContent>
  </Card>
);

const ForBusinessesSection: React.FC = () => {
  const router = useRouter();
  const businessFeatures: BusinessFeatureProps[] = [
    {
      icon: BiChart,
      title: "Increased Visibility",
      description:
        "Boost your online presence and reach more potential customers.",
    },
    {
      icon: BiGlobe,
      title: "Expanded Market",
      description: "Connect with outdoor enthusiasts beyond your local area.",
    },
    {
      icon: BiCalendar,
      title: "Inventory Management",
      description:
        "Optimize your rental schedule and manage inventory effectively.",
    },
    {
      icon: BiHeadphone,
      title: "Customer Support",
      description:
        "We handle inquiries, allowing you to focus on your core business.",
    },
  ];

  return (
    <section className="relative py-16 text-white rounded-lg overflow-clip">
      <div className="container mx-auto px-4 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Are you an outdoor gear store?
              <br />
              Rent with Gearyo.
            </h2>
            <p className="text-gray-300 mb-4">
              Gearyo empowers outdoor gear rental businesses to boost their
              sales and streamline operations. Our platform provides the tools
              and reach you need to grow your business.
            </p>
            <Button
              className="outline"
              onClick={() => router.push("/business")}
            >
              Start Renting
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessFeatures.map((feature, index) => (
              <BusinessFeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-black/20 absolute inset-0 -z-[9]"></div>
      <div className="absolute w-full h-full inset-0 -z-10">
        <img
          src="https://wysxkbvponpkbvsaawmd.supabase.co/storage/v1/object/public/assets/Pic%20from%20Gearyo.png"
          alt="businesses"
          className="object-cover w-full h-full blur-[5px]"
        />
      </div>
    </section>
  );
};

export default ForBusinessesSection;
