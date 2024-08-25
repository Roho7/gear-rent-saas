type Props = {};

const RibbonImage = (props: Props) => {
  return (
    <div className="h-20 w-screen">
      <img
        src="./logo-ribbon-1.png"
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  );
};

const LogoRibbon = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center my-8 gap-4">
      <RibbonImage />
    </div>
  );
};

export default LogoRibbon;
