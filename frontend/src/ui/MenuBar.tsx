import {
  createContext,
  useContext,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { NavLink } from "react-router-dom";
import Text from "./Text";

type MenuBarContext = {
  isOpen: boolean;
  toggle: () => void;
};
const MenuBarContext = createContext<MenuBarContext | undefined>(undefined);

function MenuBar({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <MenuBarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </MenuBarContext.Provider>
  );
}

function useMenuBar() {
  const context = useContext(MenuBarContext);

  if (!context)
    throw new Error(
      "MenuBarContext can not be used outside the MenuBar component.",
    );

  return context;
}

function Window({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen } = useMenuBar();

  return (
    <div className={`relative w-18`}>
      <div
        data-menubar-window
        className={`border-r border-white-tertiary bg-white-primary flex flex-col p-2 h-screen absolute top-0 left-0 z-10 transition-all duration-300 ${isOpen ? "w-60" : "w-18 items-center justify-start"} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

function TopBar({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen } = useMenuBar();

  return (
    <div
      className={`flex gap-1 ${
        isOpen
          ? "flex-row-reverse items-center justify-between"
          : "flex-col items-center"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Item({
  item,
  text,
  type = "normal",
}: {
  item: ReactNode;
  text: string;
  type?: "bold" | "normal";
}) {
  const { isOpen } = useMenuBar();

  return (
    <div
      className={`flex items-center gap-1 my-2 ${isOpen ? "flex-row" : "flex-col"} shrink-0`}
    >
      {item}
      <Text
        type={type === "normal" ? "p" : "h3"}
        className={isOpen ? "visible" : "hidden"}
      >
        {text}
      </Text>
    </div>
  );
}

function Trigger({
  children,
  className = "",
}: {
  children: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  className?: string;
}) {
  const { isOpen, toggle } = useMenuBar();

  return (
    <button
      className={`w-fit ${className}`}
      onClick={toggle}
      aria-expanded={isOpen}
    >
      {typeof children === "function" ? children(isOpen) : children}
    </button>
  );
}

function ContentOnOpen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen } = useMenuBar();

  return (
    <div className={`w-full ${isOpen ? "block" : "hidden"} ${className}`}>
      {children}
    </div>
  );
}

type ButtonBaseProps = {
  icon: ReactNode;
  label: string;
  className?: string;
};
type ButtonProps =
  | (ButtonBaseProps & { to: string; onClick?: never })
  | (ButtonBaseProps & {
      to?: never;
      onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    });

function Button({ icon, label, className = "", to, onClick }: ButtonProps) {
  const { isOpen } = useMenuBar();

  const base = `border border-white-tertiary p-3 rounded-full flex items-center gap-3 p-2 my-1 cursor-pointer ${
    isOpen ? "w-full justify-start" : "w-fit justify-center"
  }`;

  const content = (
    <>
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      {isOpen && <span className="whitespace-nowrap truncate">{label}</span>}
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        title={isOpen ? undefined : label}
        aria-label={label}
        className={`${base} ${className}`}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={isOpen ? undefined : label}
      aria-label={label}
      className={`${base} ${className}`}
    >
      {content}
    </button>
  );
}

MenuBar.Window = Window;
MenuBar.TopBar = TopBar;
MenuBar.Trigger = Trigger;
MenuBar.Item = Item;
MenuBar.ContentOnOpen = ContentOnOpen;
MenuBar.Button = Button;

export default MenuBar;
