import { redirect } from "next/navigation";

export default function Page() {
  // Redirect root to dashboard
  redirect("/dashboard");
}
