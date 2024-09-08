type Props = {
  title: string;
  offer?: string;
  image: string;
};

const StoreHeader = ({ title, offer, image }: Props) => {
  return (
    <div className="rounded-md relative overflow-hidden p-4 my-4">
      <h1 className="text-[150px] text-white relative">{title}</h1>
      <div className="absolute inset-0 -z-10">
        <img src={image} alt="cover-img" className="absolute inset-0" />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
    </div>
  );
};

export default StoreHeader;
