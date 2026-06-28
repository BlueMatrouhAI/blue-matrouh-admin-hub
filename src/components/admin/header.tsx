import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";
import { useUser } from "@/hooks/useUser";

const Header = () => {
  const { setOpen } = useMenu();
  const {user} = useUser()
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-6">
      <Button
        variant={"ghost"}
        size={"icon"}
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
      <div className="flex-1"/>
      <div className="flex items-center gap-3 text-sm">
        <div className="text-right leading-tight">
          <div className="font-medium">
            {user?.username}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.email}
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
          {user?.username?.slice(0, 1).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;
