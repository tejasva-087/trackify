import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import Logo from "./Logo";
import Text from "./Text";

type MenuBarProps = {
  className?: string;
  children: ReactNode;
};
type MenuBarContext = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const MenuBarContext = createContext<MenuBarContext | undefined>(undefined);

function MenuBar({ className, children }: MenuBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuBarContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        className={`h-full relative w-18
      `}
      >
        <nav
          className={`bg-white-primary border-r border-white-tertiary absolute top-0 left-0 z-10 h-screen p-3 transition-all duration-300 ${isOpen ? "w-64" : "w-18"} ${className}`}
        >
          {children}
        </nav>
      </div>
    </MenuBarContext.Provider>
  );
}

function useMenuBarContext() {
  const context = useContext(MenuBarContext);
  if (!context) {
    throw new Error(
      "MenuBar compound components must be used within a MenuBar",
    );
  }
  return context;
}

function FlexibleLogo() {
  const { isOpen } = useMenuBarContext();
  return (
    <div className={`grid grid-cols-[auto_1fr] items-center gap-1`}>
      <Logo className="w-12 h-12" />
      <Text
        type="h3"
        className={`overflow-hidden whitespace-nowrap transition-all ${
          isOpen
            ? "opacity-100 max-w-xs duration-300"
            : "opacity-0 max-w-0 duration-0"
        }`}
      >
        Trackify
      </Text>
    </div>
  );
}

function OpenButton({
  openIcon,
  closeIcon,
  className = "",
}: {
  openIcon: ReactNode;
  closeIcon: ReactNode;
  className?: string;
}) {
  const { isOpen, setIsOpen } = useMenuBarContext();

  return (
    <div
      className={`w-full flex items-center ${isOpen ? "justify-end" : "justify-center"} ${className}`}
    >
      <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? closeIcon : openIcon}
      </button>
    </div>
  );
}

MenuBar.FlexibleLogo = FlexibleLogo;
MenuBar.OpenButton = OpenButton;

export default MenuBar;
