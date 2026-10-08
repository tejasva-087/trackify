import type { MouseEvent } from "react";

import {
  TextIndentIcon,
  TextOutdentIcon,
  PlusIcon,
  SignOutIcon,
} from "@phosphor-icons/react";

import useLogout from "../authentication/hooks/useLogout";
import { useCalendar } from "./context/CalenderContext";

import MenuBar from "../../ui/MenuBar";
import Logo from "../../ui/Logo";
import MiniCalendar from "./MiniCalendar";

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
        </MenuBar.ContentOnOpen>

        <div className="border-t border-white-tertiary"></div>

        <div className="h-full flex flex-col items-start justify-between">
          <div className="w-full">
            <div className="border-t border-white-tertiary mt-5"></div>
            <MenuBar.Button
              onClick={handleAddEvent}
              icon={<PlusIcon className="w-6 h-6" />}
              label="New event"
              className="mt-4 border border-white-tertiary p-3"
            />
            <div className="border-t border-white-tertiary mt-5"></div>
          </div>

          <MenuBar.Button
            className="border-danger! text-danger! p-2 w-fit!"
            onClick={() => logout()}
            icon={<SignOutIcon className="w-6 h-6" weight="regular" />}
            label={isLoggingOut ? "Logging out..." : "Log out"}
          />
        </div>
      </MenuBar.Window>
    </MenuBar>
  );
}

export default AppNavigation;
