import { Badge } from "@/components/ui/badge";
import { servicesList } from "@/src/entities/models/constants";
import React from "react";

interface ServiceProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

const ServiceCard: React.FC<ServiceProps> = ({
  icon: Icon,
  title,
  description,
  link,
}) => (
  <div
    className={"relative h-[400px] rounded-2xl overflow-clip p-2 flex flex-col"}
  >
    {/* <Icon className="w-12 h-12 mb-4 text-primary" /> */}
    <div className="bg-background p-4 rounded-xl flex flex-col mt-auto">
      <Badge variant={"outline"} className="bg-muted/20 text-muted mx-auto">
        {<Icon />}
      </Badge>
      <h4>{title}</h4>
      <p className="text-muted">{description}</p>
    </div>

    <div className="absolute inset-0 w-full h-full -z-10">
      <img src={link} alt={title} className="object-cover w-full h-full" />
    </div>
  </div>
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
