import { TextIndentIcon, TextOutdentIcon } from "@phosphor-icons/react";
import MenuBar from "./MenuBar";
import Logo from "./Logo";
import Text from "./Text";

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

          <MenuBar.Header>
            {(isOpen) => (
              <div
                className={`flex items-center gap-1 my-2 ${isOpen ? "flex-row" : "flex-col"} shrink-0`}
              >
                <Logo className="w-12" />
                <Text type="h3" className={isOpen ? "visible" : "hidden"}>
                  Trackify
                </Text>
              </div>
            )}
          </MenuBar.Header>
        </MenuBar.TopBar>
      </MenuBar.Window>
    </MenuBar>
  );
}

export default AppNavigation;
{
  /* <MenuBar.Header>
          <MenuHeader />
        </MenuBar.Header>
        <MenuBar.Trigger>
          <OpenMenuButton />
        </MenuBar.Trigger>
        <MenuBar.Content side="left">
          <MenuAndAllStuff />
        </MenuBar.Content> */
}
