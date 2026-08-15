import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
};

function Logo({ className = "" }: LogoProps) {
  return (
    <Link to="/">
      <img
        src="/logo.svg"
        alt="Trackify logo"
        className={`inline-block ${className}`}
      />
    </Link>
  );
}

export default Logo;
