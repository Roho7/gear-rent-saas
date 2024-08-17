"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "../../_components/product-card";
import { useAuth } from "../../_providers/useAuth";
import StoreHeader from "./_components/store-header";

type Props = {};

const StorePage = (props: Props) => {
  const { products, stores } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <StoreHeader
        title="Adventure Store"
        image="https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />

      <div className="flex gap-2 justify-start max-w-fit">
        <Select>
          <SelectTrigger id="framework">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="sveltekit">SvelteKit</SelectItem>
            <SelectItem value="astro">Astro</SelectItem>
            <SelectItem value="nuxt">Nuxt.js</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger id="framework">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="sveltekit">SvelteKit</SelectItem>
            <SelectItem value="astro">Astro</SelectItem>
            <SelectItem value="nuxt">Nuxt.js</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 grid-cols-4 ">
        {products?.map((d, index) => {
          return <ProductCard product={d} key={d.product_id} />;
        })}
      </div>
    </div>
  );
};

export default StorePage;
