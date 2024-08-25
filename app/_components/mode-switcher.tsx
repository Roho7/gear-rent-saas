import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

type Props = {};

const ModeSwitcher = (props: Props) => {
  const { setTheme, theme } = useTheme();
  return (
    <div>
      <Switch
        id="mode-switch"
        checked={theme === "dark"}
        onCheckedChange={(check) => {
          setTheme(check ? "dark" : "light");
        }}
      />
    </div>
  );
};

export default ModeSwitcher;
