import { apiInstance } from "@/api/api";
import { createClient } from "@/utils/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//upload a file to supaabase and get a public url
//
export async function UploadToS3(file: File): Promise<string | null> {
  //upload the file to go backend go then uploads the file to supabase and then returns a presigned url
  console.log("file called");
  console.log(file);

  const formdata = new FormData();
  formdata.append("chat-file", file);
  try {
    const response = await apiInstance.post("/user/upload", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status <= 300) {
      return response.data.url;
    }
  } catch (err) {
    toast("something went wrong", { description: "something went wrong" });
  }
  return null;
}
