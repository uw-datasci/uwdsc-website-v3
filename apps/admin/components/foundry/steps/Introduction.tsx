import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@uwdsc/ui";
import { Layers, Zap, Shield, Rocket } from "lucide-react";

export function Introduction() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Welcome to the Foundry</h3>
        <p className="text-sm text-muted-foreground">
          Foundry helps you spin up new projects in seconds with standard
          infrastructure, CI/CD pipelines, and manages secrets out of the box.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="px-4 py-2.5 flex flex-row items-center gap-2 space-y-0">
            <Layers className="size-5 text-primary" />
            <CardTitle className="text-sm">Template Repositories</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <CardDescription className="text-xs">
              Pre-configured repositories with best-practice tooling and styles.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-2.5 flex flex-row items-center gap-2 space-y-0">
            <Zap className="size-5 text-amber-500" />
            <CardTitle className="text-sm">Instant Deployments</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <CardDescription className="text-xs">
              Automated deployments configured for immediate shipping.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-2.5 flex flex-row items-center gap-2 space-y-0">
            <Shield className="size-5 text-blue-500" />
            <CardTitle className="text-sm">Secrets Management</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <CardDescription className="text-xs">
              Environment variables and secrets synced securely.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-2.5 flex flex-row items-center gap-2 space-y-0">
            <Rocket className="size-5 text-green-500" />
            <CardTitle className="text-sm">Ready to Build</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-0">
            <CardDescription className="text-xs">
              Databases and infrastructure ready from day one.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
