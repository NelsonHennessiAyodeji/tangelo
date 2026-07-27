"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { PlusCircle, Trash2, Save, X, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TableDefinition {
  id: string;
  name: string;
  capacity: number;
}

interface TableManagerProps {
  tables: TableDefinition[];
  onChange: (tables: TableDefinition[]) => void;
}

export default function TableManager({ tables, onChange }: TableManagerProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState<number>(10);

  const startEdit = (table: TableDefinition) => {
    setEditingId(table.id);
    setEditName(table.name);
    setEditCapacity(table.capacity);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Table name is required.",
        variant: "destructive",
      });
      return;
    }
    if (editCapacity < 1) {
      toast({
        title: "Error",
        description: "Capacity must be at least 1.",
        variant: "destructive",
      });
      return;
    }

    const updated = tables.map((t) =>
      t.id === id ? { ...t, name: editName.trim(), capacity: editCapacity } : t
    );
    onChange(updated);
    setEditingId(null);
    toast({
      title: "Table updated",
      description: `Table "${editName}" saved.`,
    });
  };

  const addTable = () => {
    const newTable: TableDefinition = {
      id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Table ${tables.length + 1}`,
      capacity: 10,
    };
    onChange([...tables, newTable]);
    toast({
      title: "Table added",
      description: `New table "${newTable.name}" created.`,
    });
  };

  const deleteTable = (id: string) => {
    // Prevent deletion if guests are already assigned (we'll rely on parent to check)
    onChange(tables.filter((t) => t.id !== id));
    toast({ title: "Table removed", description: "Table has been deleted." });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          Manage Tables
        </CardTitle>
        <CardDescription>
          Define tables for this event. Guests can then be assigned to a table.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tables.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No tables defined yet. Click "Add Table" to create one.
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>
                        {editingId === table.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          table.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === table.id ? (
                          <Input
                            type="number"
                            min="1"
                            value={editCapacity}
                            onChange={(e) =>
                              setEditCapacity(parseInt(e.target.value) || 1)
                            }
                            className="h-8 w-20"
                          />
                        ) : (
                          table.capacity
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {editingId === table.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => saveEdit(table.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => startEdit(table)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteTable(table.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button onClick={addTable} variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Table
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
