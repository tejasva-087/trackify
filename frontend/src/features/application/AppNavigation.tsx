import { TextIndentIcon, TextOutdentIcon } from "@phosphor-icons/react";
import MenuBar from "../../ui/MenuBar";
import Logo from "../../ui/Logo";
import MiniCalendar from "./MiniCalendar";

function AppNavigation() {
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

        <MenuBar.Content>
          <MiniCalendar />
        </MenuBar.Content>
      </MenuBar.Window>
    </MenuBar>
  );
}

export default AppNavigation;
