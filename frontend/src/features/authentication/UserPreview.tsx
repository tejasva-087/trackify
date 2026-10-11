import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import Text from "../../ui/Text";
import AppNavigation from "../application/AppNavigation";
import useUser from "./hooks/useUser";

function UserPreview() {
  const { user, isPending } = useUser();

  if (isPending)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="grid h-dvh w-full grid-cols-[auto_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden">
      <AppNavigation />
      <main className="min-h-0 min-w-0 overflow-hidden p-12">
        <div className="flex items-center justify-between mb-12">
          <Text type="h2">Your account</Text>
          <Button className="w-fit!" type="primary" to="/application">
            Go back
          </Button>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-t border-white-tertiary p-6 items-center">
            <Text type="h4" className="font-bold text-black-secondary">
              Profile
            </Text>
            {user?.image ? (
              <img className="w-10 h-10 rounded-xl" src={user?.image} alt="" />
            ) : (
              <img
                className="w-10 h-10 rounded-xl"
                src={`https://api.dicebear.com/10.x/initial-face/svg?seed=${user?.name}`}
                alt="avatar"
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-white-tertiary p-6 items-center">
            <Text type="h4" className="font-bold text-black-secondary">
              Full name
            </Text>
            <Text>{user?.name as string}</Text>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-white-tertiary p-6 items-center">
            <Text type="h4" className="font-bold text-black-secondary">
              Email
            </Text>
            <Text>{user?.email as string}</Text>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserPreview;

// {
//     "name": "TEST USER",
//     "email": "testusee@gmail.com",
//     "emailVerified": true,
//     "image": null,
//     "createdAt": "2026-10-11T02:21:02.280Z",
//     "updatedAt": "2026-10-11T02:21:02.280Z",
//     "id": "Aw5FsdeWQJcdMlB7xKZ9S0L4Hc3Y9edx"
// }
