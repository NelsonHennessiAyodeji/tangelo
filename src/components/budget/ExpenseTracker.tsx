
'use client';

import { useState } from 'react';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircleIcon, Trash2Icon, EditIcon, XIcon, SaveIcon } from 'lucide-react';
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


interface ExpenseTrackerProps {
  expenses: Expense[];
  categories: string[];
  currentEvent: string;
  onAddExpense: (formData: FormData) => Promise<boolean>;
  onUpdateExpense: (id: string, formData: FormData) => Promise<boolean>;
  onDeleteExpense: (id: string) => Promise<void>;
}

export default function ExpenseTracker({ expenses, categories, currentEvent, onAddExpense, onUpdateExpense, onDeleteExpense }: ExpenseTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const resetForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('event', currentEvent);
    
    let success = false;
    if (editingExpense) {
      success = await onUpdateExpense(editingExpense.id, formData);
    } else {
      success = await onAddExpense(formData);
    }
    
    if (success) {
      resetForm();
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };
  
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  }

  const uniqueCategories = [...new Set([...categories, "Venue", "Caterer", "Attire", "Entertainment", "Other"])];

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="font-headline">Expense Log for {currentEvent}</CardTitle>
          <CardDescription>Track your spending for this event.</CardDescription>
        </div>
        <Button onClick={openAddForm} size="sm">
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-card space-y-4">
            <h3 className="text-lg font-semibold">{editingExpense ? "Edit Expense" : "Add New Expense"}</h3>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={editingExpense?.name} placeholder="e.g., Catering Deposit" required/>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={editingExpense?.category}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input id="amount" name="amount" type="number" defaultValue={editingExpense?.amount} placeholder="e.g., 500000" required/>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm} size="sm"><XIcon className="mr-1 h-4 w-4" />Cancel</Button>
              <Button type="submit" size="sm"><SaveIcon className="mr-1 h-4 w-4" />{editingExpense ? "Update Expense" : "Save Expense"}</Button>
            </div>
          </form>
        )}

        {expenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount (₦)</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.sort((a,b) => b.date.getTime() - a.date.getTime()).map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.name}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right">₦{expense.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{expense.date.toLocaleDateString()}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the expense item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteExpense(expense.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
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
          <p className="text-center text-muted-foreground py-4">No expenses logged yet. Click "Add Expense" to start.</p>
        )}
      </CardContent>
    </Card>
  );
}
