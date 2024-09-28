import Link from "next/link";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="bg-black p-8 h-40 grid grid-cols-4 text-muted text-xs">
      <ul>
        <li>
          <Link href="/store">Shop</Link>
        </li>
        <li>
          <Link href="/business">Business</Link>
        </li>
        <li>
          <Link href="/seller">All Sellers</Link>
        </li>
        <li>
          <Link href="/guide">Guides</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
      </ul>
      <ul></ul>
      <ul>
        <a href="/" className="text-white font-bold">
          <img src="/logo-white-large.svg" alt="" width={100} />
        </a>
      </ul>
    </div>
  );
};

export default Footer;
