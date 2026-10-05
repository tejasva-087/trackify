import {
  TextIndentIcon,
  TextOutdentIcon,
  PlusIcon,
  UserIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import MenuBar from "../../ui/MenuBar";
import Logo from "../../ui/Logo";
import MiniCalendar from "./MiniCalendar";
import { useCalendar } from "./context/CalenderContext";
import useLogout from "../authentication/hooks/useLogOut";

function AppNavigation() {
  const { openSelection } = useCalendar();
  const { logout, isLoggingOut } = useLogout();

  function handleAddEvent(e: MouseEvent<HTMLButtonElement>) {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuRect = e.currentTarget
      .closest("[data-menubar-window]")
      ?.getBoundingClientRect();

    const edge = menuRect?.right ?? buttonRect.right;

    const position = {
      x: edge,
      y: buttonRect.top,
      width: 0,
      height: buttonRect.height,
      top: buttonRect.top,
      right: edge,
      bottom: buttonRect.bottom,
      left: edge,
    };

    // Default: next full hour, 1 hour long
    const start = new Date();
    start.setHours(start.getHours() + 1, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    openSelection({ start, end, allDay: false }, position);
  }

  return (
    <MenuBar>
      <MenuBar.Window>
        <MenuBar.TopBar>
          <MenuBar.Trigger>
            {(isOpen) =>
              isOpen ? (
                <TextOutdentIcon
                  className="cursor-pointer w-6 h-6"
                  weight="regular"
                />
              ) : (
                <TextIndentIcon
                  className="cursor-pointer w-6 h-6"
                  weight="regular"
                />
              )
            }
          </MenuBar.Trigger>

          <MenuBar.Item
            item={<Logo className="w-12" />}
            text="Trackify"
            type="bold"
          />
        </MenuBar.TopBar>

        <MenuBar.ContentOnOpen>
          <MiniCalendar />
          <div className="border-t border-white-tertiary mt-5"></div>
        </MenuBar.ContentOnOpen>

        <div className="h-full flex flex-col items-center justify-between">
          <MenuBar.Button
            onClick={handleAddEvent}
            icon={<PlusIcon className="w-6 h-6" />}
            label="New event"
            className="mt-4   "
          />
          <div className="w-full flex flex-col gap-2">
            <MenuBar.Button
              to="/user"
              icon={<UserIcon className="w-6 h-6" />}
              label="Your account"
            />
            <MenuBar.Button
              className="border-danger! text-danger!"
              onClick={() => logout()}
              icon={<SignOutIcon className="w-6 h-6" weight="regular" />}
              label={isLoggingOut ? "Logging out..." : "Log out"}
            />
          </div>
        </div>
      </MenuBar.Window>
    </MenuBar>
  );
}

export default AppNavigation;
