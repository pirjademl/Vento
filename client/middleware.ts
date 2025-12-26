import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { apiInstance } from "@/api/api";
import { AxiosError, isAxiosError } from "axios";

export default async function MIddleware(
  req: NextRequest,
  response: Response,
  next: NextMiddleware,
) {
  if (req.nextUrl.pathname === "/login") {
    console.log("true");
    try {
      localStorage.getItem("access_token");
      const response = await apiInstance.get("/rooms");
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        NextResponse.redirect("/rooms");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        NextResponse.redirect("/login");
        return;
      }
    }
  }
  const res = await apiInstance.post("/auth/user");
  if (res.status == 403) {
    return NextResponse.redirect("/login");
  }
  console.log("false");
}
