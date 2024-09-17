import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      onClick={() => router.back()}
      size="sm"
      className="bg-white max-w-fit mr-auto shrink-0 mb-2"
    >
      <FiChevronLeft /> Back
    </Button>
  );
};

export default BackButton;
