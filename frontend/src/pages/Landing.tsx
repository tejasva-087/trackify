import Text from "../ui/Text";

import heroImage from "../assets/heroImage.png";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

function Landing() {
  return (
    <div className="min-h-dvh md:h-dvh flex flex-col">
      <header className="shrink-0 p-3 flex justify-between items-center border-b border-white-tertiary">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-10 md:h-12 md:w-12" />
          <Text type="h2">Trackify</Text>
        </div>
        <Button to="/sign-up" type="primary" className="w-fit! border-none!">
          Get started
        </Button>
      </header>

      <main className="flex-1 md:min-h-0 p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 md:grid-rows-1 gap-8 place-items-center">
        <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
          <Text type="h1">
            <div className="flex flex-col gap-2">
              <span>Just tell it your plans.</span>{" "}
              <span>
                <span className="text-primary">Trackify</span> does the
                scheduling.
              </span>
            </div>
          </Text>
          <Text type="h3" className="font-normal!">
            Type your week the way you would say it. Trackify turns it into a
            calendar, spots clashes, and suggests smart fixes instead of just
            flagging them.
          </Text>
          <Button to="/sign-up" type="primary" className="w-fit! border-none!">
            Get started
          </Button>
        </div>

        <div className="w-full md:h-full md:min-h-0 flex items-center justify-center">
          <img
            src={heroImage}
            alt="Image showing the Trackify web app"
            className="w-full h-auto md:w-auto md:max-h-full md:max-w-full object-contain border border-white-tertiary rounded-2xl"
          />
        </div>
      </main>

      <footer className="shrink-0 p-3 flex flex-col gap-1 items-center text-center md:flex-row md:justify-between md:text-left border-t border-white-tertiary">
        <Text>All rights reserved</Text>
        <Text>
          <>
            Made with love by{" "}
            <a
              href="https://tejuss.memorymap.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Tejasav Khandelwal
            </a>
          </>
        </Text>
      </footer>
    </div>
  );
}

export default Landing;
