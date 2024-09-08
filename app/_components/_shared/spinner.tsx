type Props = {};

const Spinner = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen absolute top-0 left-0 right-0 bottom-0">
      <div className="animate-pulse ring-offset-2  ring-[8px] ring-black h-4 w-4 rounded-full" />
      <div className="bg-black h-[8px] w-8 my-3 animate-pulse"></div>
    </div>
  );
};

export default Spinner;
