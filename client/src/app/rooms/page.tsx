"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useFetch } from "@/utils/use-fetch";
import { useRouter } from "next/navigation";
import { apiInstance } from "@/api/api";

interface IRoom {
  name: string;
  description: string;
  password: string;
  owner_id: number;
  max_limit: number;
  category: string;
}

type RoomRespnse = Pick<IRoom, "name" | "description" | "category"> & {
  room_id: string;
  limit: number;
  owner_name: string;
};
export default function Rooms() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<number>();
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const [room, setRoom] = useState<IRoom>({
    category: "",
    max_limit: 2,
    owner_id: 1,
    name: "",
    password: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    try {
      const response = await apiInstance.post("/rooms", room);

      if (response.status === 201) {
        console.log(response.data);
        refetch();
      }
      //refetch the rooms after sending a request
    } catch (err) {
      alert("something went wrong");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoom((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleRoomJoin = async (e: FormEvent<HTMLFormElement>) => {
    console.log(e.target);

    e.preventDefault();
    try {
      const response = await apiInstance.post("/rooms/join", {
        room_id: roomId,
        password: roomPassword,
      });
      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("room_token", response.data.room_token);
        router.push(`/rooms/${roomId}`);
      }
    } catch (err) {
      toast("error joining the room", {
        description: "something went wrong while joining the room",
      });
    }
  };

  const { data: rooms, isError, isLoading, refetch } = useFetch("/rooms");

  return (
    <div className=" p-4 ">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Create Room</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create a New Room</DialogTitle>
            <DialogDescription>
              Fill in the details below to create your new room.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              onChange={handleChange}
              name="name"
              placeholder="Room Name"
              required
            />
            <Input
              onChange={handleChange}
              name="description"
              placeholder="Description"
            />
            <Input
              onChange={handleChange}
              name="category"
              placeholder="Category"
            />
            <Input
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="room password"
            />
            <Input
              name="max_limit"
              placeholder="Max Participants"
              type="number"
              onChange={handleChange}
            />
            <Input placeholder="Tags (comma separated)" />
            <DialogFooter>
              <Button type="submit">Create Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {isError && <div>something went wrong </div>}
      {rooms === null && <div>No room Found please create one </div>}

      {isLoading ? (
        <div className="flex items-center justify-center ">Loading ...</div>
      ) : (
        <div className="mt-15">
          created rooms
          <div className="mt-14 grid grid-cols-1  md:grid-cols-2  lg:grid-cols-3  2xl:grid-cols-4 gap-4  p-4">
            {rooms &&
              rooms.map((room: RoomRespnse) => (
                <div
                  key={room.room_id}
                  className="border  p-4 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg">{room.name}</h3>
                  </div>
                  <span className="text-xs">{room.description}</span>
                  <div>
                    room limit :
                    <span className="text-sm font-bold">{room.limit}</span>
                  </div>
                  <span className="font-bold text-right ">
                    created by : {room.owner_name}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Join </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>Join the Room</DialogTitle>
                        <DialogDescription>
                          Fill in the details below to join room.
                        </DialogDescription>
                      </DialogHeader>

                      <form
                        onSubmit={handleRoomJoin}
                        className="flex flex-col gap-3"
                      >
                        <Input
                          name="room_id"
                          type="text"
                          disabled
                          value={room.room_id}
                          placeholder="room password"
                        />

                        <Input
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setRoomPassword(e.target.value);
                          }}
                          name="password"
                          type="password"
                          placeholder="room password"
                        />
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => {
                              setRoomId((prev) => room.room_id);
                            }}
                          >
                            Join Room
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
