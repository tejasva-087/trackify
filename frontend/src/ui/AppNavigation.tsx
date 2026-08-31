import { ListIcon, XIcon } from "@phosphor-icons/react";
import MenuBar from "./MenuBar";

function AppNavigation() {
  return (
    <MenuBar>
      <MenuBar.OpenButton
        className="mb-2"
        openIcon={<ListIcon className="text-2xl" weight="bold" />}
        closeIcon={<XIcon className="text-2xl" weight="bold" />}
      />
      <MenuBar.FlexibleLogo />
    </MenuBar>
  );
}

export default AppNavigation;
