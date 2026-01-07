"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
} from "@uwdsc/ui";
import { Loader2, ArrowLeft } from "lucide-react";

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    registration_required: false,
    payment_required: true,
    start_time: "",
    buffered_start_time: "",
    end_time: "",
    buffered_end_time: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[EVENT CREATE] Starting form submission");
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Calculate buffered times if not provided
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      const bufferedStartTime = formData.buffered_start_time
        ? new Date(formData.buffered_start_time)
        : new Date(startTime.getTime() - 30 * 60 * 1000); // 30 minutes before
      const bufferedEndTime = formData.buffered_end_time
        ? new Date(formData.buffered_end_time)
        : new Date(endTime.getTime() + 30 * 60 * 1000); // 30 minutes after

      const requestBody = {
        name: formData.name,
        description: formData.description || null,
        location: formData.location || null,
        registration_required: formData.registration_required,
        payment_required: formData.payment_required,
        start_time: startTime.toISOString(),
        buffered_start_time: bufferedStartTime.toISOString(),
        end_time: endTime.toISOString(),
        buffered_end_time: bufferedEndTime.toISOString(),
      };

      console.log("[EVENT CREATE] Request body:", requestBody);

      console.log("[EVENT CREATE] Sending fetch request...");
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("[EVENT CREATE] Response status:", response.status);
      console.log("[EVENT CREATE] Response ok:", response.ok);

      let data;
      try {
        const text = await response.text();
        console.log("[EVENT CREATE] Response text:", text);
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("[EVENT CREATE] Failed to parse response:", parseError);
        throw new Error("Invalid response from server");
      }

      console.log("[EVENT CREATE] Parsed data:", data);

      if (response.ok) {
        console.log("[EVENT CREATE] Success! Event created");
        setSuccess(true);
        // Redirect to events page after 1 second
        setTimeout(() => {
          router.push("/admin/events");
        }, 1000);
      } else {
        console.error("[EVENT CREATE] Error response:", data);
        setError(data.message || data.error || "Failed to create event");
      }
    } catch (err) {
      console.error("[EVENT CREATE] Exception caught:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create event. Please try again."
      );
    } finally {
      console.log("[EVENT CREATE] Setting loading to false");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/events")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add New Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Event Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Enter event name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter event description"
                rows={4}
                className="w-full p-3 border rounded-md bg-background resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter event location"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Start Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                required
              />
            </div>

            {/* Buffered Start Time */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Buffered Start Time (optional, defaults to 30 min before)
              </label>
              <Input
                type="datetime-local"
                value={formData.buffered_start_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buffered_start_time: e.target.value,
                  })
                }
              />
            </div>

            {/* End Time */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                End Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                required
              />
            </div>

            {/* Buffered End Time */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Buffered End Time (optional, defaults to 30 min after)
              </label>
              <Input
                type="datetime-local"
                value={formData.buffered_end_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buffered_end_time: e.target.value,
                  })
                }
              />
            </div>

            {/* Registration Required */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="registration_required"
                checked={formData.registration_required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registration_required: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
              <label htmlFor="registration_required" className="text-sm">
                Registration Required
              </label>
            </div>

            {/* Payment Required */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="payment_required"
                checked={formData.payment_required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_required: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
              <label htmlFor="payment_required" className="text-sm">
                Payment Required
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-md bg-red-500/10 text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-md bg-green-500/10 text-green-500 border border-green-500/20">
                Event created successfully! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/events")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

