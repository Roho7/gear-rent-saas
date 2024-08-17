type Props = {
  title: string;
  offer?: string;
  image: string;
};

const StoreHeader = ({ title, offer, image }: Props) => {
  return (
    <div className="rounded-md relative overflow-hidden p-4 my-4">
      <h1 className="text-[150px] text-white">{title}</h1>
      <img src={image} alt="cover-img" className="absolute inset-0 -z-10" />
    </div>
  );
};

export default StoreHeader;
