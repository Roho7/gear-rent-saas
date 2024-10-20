import { Badge } from "@/components/ui/badge";

type Props = {
  name: string;
};

const AuthorBadge = ({ name }: Props) => {
  return <Badge variant={"outline"}>{name}</Badge>;
};

export default AuthorBadge;
