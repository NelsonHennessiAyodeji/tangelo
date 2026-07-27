"use client";

import React, { useState } from "react";
import type { Guest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircleIcon,
  UsersIcon,
  Trash2Icon,
  EditIcon,
  SaveIcon,
  XIcon,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GuestImportDialog from "./GuestImportDialog";
import type { TableDefinition } from "./TableManager";

interface GuestManagementProps {
  guests: Guest[];
  tables: TableDefinition[]; // added
  currentEvent: string;
  onAddGuest: (formData: FormData) => Promise<boolean>;
  onUpdateGuest: (id: string, formData: FormData) => Promise<boolean>;
  onDeleteGuest: (guestId: string) => Promise<void>;
  onImportGuests: (guests: Omit<Guest, "id">[]) => Promise<void>;
}

export default function GuestManagement({
  guests,
  tables,
  currentEvent,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
  onImportGuests,
}: GuestManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const { toast } = useToast();

  const resetForm = () => {
    setShowForm(false);
    setEditingGuest(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("event", currentEvent);

    let success = false;
    if (editingGuest) {
      success = await onUpdateGuest(editingGuest.id, formData);
    } else {
      success = await onAddGuest(formData);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onDeleteGuest(id);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleExport = () => {
    if (guests.length === 0) {
      toast({
        title: "No Guests",
        description: "There are no guests to export for this event.",
        variant: "destructive",
      });
      return;
    }
    const dataStr = JSON.stringify(guests, null, 2);
    navigator.clipboard.writeText(dataStr).then(
      () => {
        toast({
          title: "Copied to Clipboard",
          description: `Guest list for ${currentEvent} has been copied as JSON.`,
        });
      },
      (err) => {
        toast({
          title: "Export Failed",
          description: "Could not copy data to clipboard.",
          variant: "destructive",
        });
        console.error("Could not copy text: ", err);
      }
    );
  };

  // Helper to get table name by id
  const getTableName = (tableId?: string) => {
    if (!tableId) return "—";
    const table = tables.find((t) => t.id === tableId);
    return table ? table.name : "Unknown";
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="font-headline flex items-center">
            <UsersIcon className="mr-2 h-6 w-6 text-primary" />
            Guest List
          </CardTitle>
          <CardDescription>
            Manage guests for the {currentEvent}.
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <GuestImportDialog onImport={onImportGuests} />
          <Button onClick={handleExport} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={openAddForm} size="sm">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Guest
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 border rounded-lg bg-card space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {editingGuest ? "Edit Guest" : "Add New Guest"}
            </h3>
            <div>
              <Label htmlFor="guestName">Full Name*</Label>
              <Input
                id="guestName"
                name="name"
                defaultValue={editingGuest?.name}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="rsvpStatus">RSVP Status</Label>
              <Select
                name="rsvp_status"
                defaultValue={editingGuest?.rsvp_status || "Pending"}
              >
                <SelectTrigger id="rsvpStatus">
                  <SelectValue placeholder="Select RSVP status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietaryRestrictions"
                name="dietary_restrictions"
                defaultValue={editingGuest?.dietary_restrictions}
                placeholder="e.g., Vegetarian, Gluten-Free"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="tableAssignment">Table Assignment</Label>
              <Select
                name="tableId"
                defaultValue={editingGuest?.tableId || "none"}
              >
                <SelectTrigger id="tableAssignment">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No table assigned</SelectItem>
                  {tables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.name} (Capacity: {table.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                size="sm"
              >
                <XIcon className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" size="sm">
                <SaveIcon className="mr-1 h-4 w-4" />
                {editingGuest ? "Update Guest" : "Save Guest"}
              </Button>
            </div>
          </form>
        )}

        {guests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead>Dietary Needs</TableHead>
                <TableHead>Table</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        guest.rsvp_status === "Accepted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : guest.rsvp_status === "Declined"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {guest.rsvp_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {guest.dietary_restrictions || "None"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getTableName(guest.tableId)}
                  </TableCell>
                  <TableCell className="text-center space-x-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(guest)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Guest?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove guest "{guest.name}
                            "? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(guest.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No guests added yet for this event. Click "Add Guest" to start.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Total Guests for {currentEvent}: {guests.length}
        </p>
      </CardFooter>
    </Card>
  );
}
