import {
  createContext,
  useContext,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { NavLink } from "react-router-dom";
import Text from "./Text";

type MenuBarContextType = {
  isOpen: boolean;
  toggle: () => void;
};
const MenuBarContext = createContext<MenuBarContextType | undefined>(undefined);

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
    <div className="relative w-14 shrink-0 md:w-18">
      <div
        data-menubar-window
        className={`absolute left-0 top-0 z-30 flex h-full flex-col overflow-y-auto overflow-x-hidden border-r border-white-tertiary bg-white-primary p-2 transition-all duration-300 ${
          isOpen
            ? "w-60 max-w-[85vw]"
            : "w-14 items-center justify-start md:w-18"
        } ${className}`}
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
      className={`my-2 flex shrink-0 items-center gap-1 ${isOpen ? "flex-row" : "flex-col"}`}
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
  children: ReactNode | ((isOpen: boolean) => ReactNode);
  className?: string;
}) {
  const { isOpen, toggle } = useMenuBar();

  return (
    <button
      type="button"
      className={`w-fit touch-manipulation p-1 ${className}`}
      onClick={toggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Collapse menu" : "Expand menu"}
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

  const base = `rounded-full flex items-center gap-2 my-1 cursor-pointer touch-manipulation ${
    isOpen ? "w-full justify-start" : "w-fit justify-center"
  }`;

  const content = (
    <>
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      {isOpen && <span className="truncate whitespace-nowrap">{label}</span>}
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
