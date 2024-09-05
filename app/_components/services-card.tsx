import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { servicesList } from "@/data/contants";

interface ServiceProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <Card className="">
    <CardHeader>
      <Icon className="w-12 h-12 mb-4 text-primary" />
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted">{description}</p>
    </CardContent>
  </Card>
);

const ServicesSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        {/* <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {servicesList.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
