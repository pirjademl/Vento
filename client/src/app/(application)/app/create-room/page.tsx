import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RoomCreatePage() {
  return (
    <div className="flex max-w-5xl  h-[100vh] items-center justify-center border">
      <div className="flex flex-col gap-3 gap-4">
        <div className="flex flex-col gap-3 gap-4">
          <Input placeholder="name of the room" className="w-[100vh]" />
          <Input placeholder="passowrd of the room" />
        </div>
        <div>
          <Button> create room </Button>
        </div>
      </div>
    </div>
  );
}
