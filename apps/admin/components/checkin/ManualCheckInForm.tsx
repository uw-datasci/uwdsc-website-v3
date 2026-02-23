import { Search } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@uwdsc/ui";
import type { Event, Member } from "@uwdsc/common/types";

interface ManualCheckInFormProps {
  events: Event[];
  profiles: Member[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProfiles: Member[];
  onCheckIn: (profileId: string) => void;
}

export function ManualCheckInForm({
  events,
  profiles,
  selectedEventId,
  setSelectedEventId,
  searchQuery,
  setSearchQuery,
  filteredProfiles,
  onCheckIn,
}: ManualCheckInFormProps) {
  return (
    <Card className="w-full text-left">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Manual Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Event</label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger defaultValue="">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Search Member</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search WatIAM, email, or name"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredProfiles.length > 0 && (
          <div className="flex flex-col gap-2 pt-2">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-md border text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {p.first_name} {p.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.wat_iam} • {p.email}
                  </span>
                </div>
                <Button size="sm" onClick={() => onCheckIn(p.id)}>
                  Check In
                </Button>
              </div>
            ))}
          </div>
        )}
        {searchQuery && filteredProfiles.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4">
            No members found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </CardContent>
    </Card>
  );
}
