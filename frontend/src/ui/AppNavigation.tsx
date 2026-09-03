import { TextIndentIcon, TextOutdentIcon } from "@phosphor-icons/react";
import MenuBar from "./MenuBar";
import Logo from "./Logo";
import MiniCalender from "./MiniCalender";

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
          <MiniCalender />
        </MenuBar.Content>
      </MenuBar.Window>
    </MenuBar>
  );
}

export default AppNavigation;
