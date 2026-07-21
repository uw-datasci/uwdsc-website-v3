import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@uwdsc/ui";
import { createAuthService } from "@/lib/services";

export default async function HiringLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const authService = await createAuthService();
  const { user, error } = await authService.getCurrentUser();
  const isPresident =
    !error && !!user && (await authService.getScopeForUser(user.id)).isPresident;

  if (!isPresident) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access restricted</CardTitle>
            <CardDescription>
              Only Presidents can access the hiring dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
