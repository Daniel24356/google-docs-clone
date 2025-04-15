import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';

const AVATAR_SIZE = 36;

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};

type UserInfo = {
  avatar: string;
  name: string;
};

const AvatarStack = () => {
  const users = useOthers((others) => others.map((user) => user.info as UserInfo));

  // Select current user's info
  const currentUser = useSelf((me) => me.info as UserInfo);

  if (users.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center">
        {currentUser && (
          <div className="relative ml-2">
            <Avatar src={currentUser.avatar} name="You" />
          </div>
        )}
        <div className="flex">
        {users.map((user, idx) => (
    <Avatar key={idx} src={user.avatar} name={user.name} />
  ))}
        </div>
      </div>
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};

interface AvatarProps {
  src: string;
  name: string;
}

const Avatar = ({ src, name }: AvatarProps) => {
  return (
    <div
      className="group -ml-2 flex-shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400"
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity">
        {name}
      </div>
      <Image 
        src={src} 
        alt={name} 
        width={AVATAR_SIZE} 
        height={AVATAR_SIZE} 
        className="rounded-full" 
      />
    </div>
  );
};
