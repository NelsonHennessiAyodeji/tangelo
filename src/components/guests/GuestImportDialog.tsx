
'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Guest } from '@/lib/types';
import { UploadIcon } from 'lucide-react';

interface GuestImportDialogProps {
  onImport: (guests: Omit<Guest, 'id' | 'wedding_id'>[]) => void;
}

export default function GuestImportDialog({ onImport }: GuestImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCsvData] = useState('');
  const { toast } = useToast();

  const handleImport = () => {
    if (!csvData.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste some CSV data to import.',
        variant: 'destructive',
      });
      return;
    }

    Papa.parse<string[]>(csvData, {
      skipEmptyLines: true,
      complete: (results) => {
        const newGuests: Omit<Guest, 'id' | 'wedding_id'>[] = [];
        let errors = 0;

        results.data.forEach((row, index) => {
          // Assuming format: Name, RSVP Status, Dietary Restrictions, Table Assignment
          const [name, rsvpStatus, dietaryRestrictions, tableAssignment] = row;
          
          if (!name) {
            console.warn(`Skipping row ${index + 1}: Name is missing.`);
            errors++;
            return;
          }

          const validRsvpStatus = ['Accepted', 'Declined', 'Pending'].includes(rsvpStatus) 
            ? rsvpStatus as Guest['rsvp_status']
            : 'Pending';

          newGuests.push({
            name: name.trim(),
            rsvp_status: validRsvpStatus,
            dietary_restrictions: (dietaryRestrictions || '').trim(),
            table_assignment: (tableAssignment || '').trim(),
          });
        });

        if (newGuests.length > 0) {
          onImport(newGuests);
          setCsvData('');
          setIsOpen(false);
        } else {
          toast({
            title: 'Import Failed',
            description: 'Could not parse any valid guests from the data. Please check the format.',
            variant: 'destructive',
          });
        }
      },
      error: (error) => {
        toast({
          title: 'Parsing Error',
          description: 'Failed to parse CSV data. Please check the format.',
          variant: 'destructive',
        });
        console.error("CSV Parsing Error:", error);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UploadIcon className="mr-2 h-4 w-4" /> Import from CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Guests from CSV</DialogTitle>
          <DialogDescription>
            Paste your CSV data below. The expected format is:
            <code className="block bg-muted p-2 rounded-md text-sm mt-2">
              Name,RSVP Status,Dietary Restrictions,Table
            </code>
            Each guest should be on a new line. Only the name is required.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="csvData">CSV Data</Label>
          <Textarea
            id="csvData"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="John Doe,Accepted,Vegan,Table 1&#10;Jane Smith,Pending,,Table 2"
            rows={10}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleImport}>Import Guests</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
