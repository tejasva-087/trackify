import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type MenuBarContext = {
  isOpen: boolean;
  toggle: () => void;
};
const MenuBarContext = createContext<MenuBarContext | undefined>(undefined);
function MenuBar({ children }: { children: ReactElement }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen(!isOpen);
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
      className={`flex gap-2 ${
        isOpen
          ? "flex-row-reverse items-center justify-between"
          : "flex-col items-center"
      } ${className}`}
    >
      {children}
    </div>
  );
}

MenuBar.TopBar = TopBar;

function Header({
  children,
}: {
  children: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
}) {
  const { isOpen } = useMenuBar();

  return <>{typeof children === "function" ? children(isOpen) : children}</>;
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

MenuBar.Window = Window;
MenuBar.Header = Header;
MenuBar.Trigger = Trigger;

export default MenuBar;
