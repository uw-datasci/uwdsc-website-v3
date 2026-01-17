"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@uwdsc/ui";
import { Search, Loader2, CheckCircle2, XCircle, Users, Code } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  display_name: string | null;
}

export default function AdminAssignVolunteersPage() {
  const [emailQuery, setEmailQuery] = useState<string>("");
  const [searching, setSearching] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [assigning, setAssigning] = useState<{ userId: string; role: string } | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!emailQuery.trim()) {
      setResult({
        success: false,
        message: "Please enter an email to search",
      });
      return;
    }

    setSearching(true);
    setResult(null);
    setUsers([]);

    try {
      const response = await fetch(`/api/admin/users/search?email=${encodeURIComponent(emailQuery.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
        if (data.users.length === 0) {
          setResult({
            success: false,
            message: "No users found matching that email",
          });
        }
      } else {
        setResult({
          success: false,
          message: data.message || data.error || "Failed to search users",
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setResult({
        success: false,
        message: "Failed to search users. Please try again.",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleAssignRole = async (userId: string, userEmail: string, role: "hacker" | "volunteer") => {
    if (!confirm(`Are you sure you want to assign ${role} role to ${userEmail}?`)) {
      return;
    }

    setAssigning({ userId, role });
    setResult(null);

    try {
      const response = await fetch("/api/admin/users/assign-volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: `Successfully assigned ${role} role to ${userEmail}`,
        });

        // Update the user's role in the local state
        setUsers(users.map(u => u.id === userId ? { ...u, role } : u));

        // Clear result after 5 seconds
        setTimeout(() => {
          setResult(null);
        }, 5000);
      } else {
        setResult({
          success: false,
          message: data.message || data.error || `Failed to assign ${role} role`,
        });
      }
    } catch (error) {
      console.error(`Error assigning ${role} role:`, error);
      setResult({
        success: false,
        message: `Failed to assign ${role} role. Please try again.`,
      });
    } finally {
      setAssigning(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assign Roles</h1>
        <p className="text-muted-foreground">
          Search for users by email and assign them hacker or volunteer roles. Only admins and superadmins can access this page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              type="email"
              value={emailQuery}
              onChange={(e) => setEmailQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter email address to search..."
              className="flex-1"
              disabled={searching}
            />
            <Button
              onClick={handleSearch}
              disabled={searching || !emailQuery.trim()}
            >
              {searching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-md flex items-center gap-2 ${
                result.success
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          {/* Users List */}
          {users.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Found {users.length} user{users.length !== 1 ? "s" : ""}:
              </h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border rounded-md flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{user.email}</div>
                      {user.display_name && (
                        <div className="text-sm text-muted-foreground">
                          {user.display_name}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Current role: <span className="font-mono">{user.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.role === "hacker" || user.role === "volunteer" ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {user.role === "hacker" ? (
                            <Code className="h-4 w-4" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                          <span>Already {user.role}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleAssignRole(user.id, user.email, "hacker")}
                            disabled={assigning?.userId === user.id}
                            variant="default"
                            size="sm"
                          >
                            {assigning?.userId === user.id && assigning?.role === "hacker" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              <>
                                <Code className="mr-2 h-4 w-4" />
                                Assign Hacker
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleAssignRole(user.id, user.email, "volunteer")}
                            disabled={assigning?.userId === user.id}
                            variant="default"
                            size="sm"
                          >
                            {assigning?.userId === user.id && assigning?.role === "volunteer" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              <>
                                <Users className="mr-2 h-4 w-4" />
                                Assign Volunteer
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
