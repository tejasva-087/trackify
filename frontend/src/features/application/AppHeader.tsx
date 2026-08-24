import Logo from "../../ui/Logo";
import Text from "../../ui/Text";

function AppHeader() {
  return (
    <header className="w-full p-4 border-r border-white-tertiary">
      <div className="flex items-center gap-1">
        <Logo className="w-12" />
        <Text type="h3">Trackify</Text>
      </div>
    </header>
  );
}

export default AppHeader;
