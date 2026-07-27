
import type { AIVendorSuggestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, InfoIcon, ExternalLink, Heart, PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSelectedVendors } from '@/hooks/use-selected-vendors';
import { useToast } from '@/hooks/use-toast';
import { mockWeddingDetails } from '@/lib/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface VendorAISuggestionResultsProps {
  suggestions: AIVendorSuggestion[];
  isLoading: boolean;
  message?: string;
}

const VendorSuggestionCard = ({ vendor }: { vendor: AIVendorSuggestion }) => {
    const { addVendor, removeVendor, isVendorSelected } = useSelectedVendors();
    const { toast } = useToast();
    const events = mockWeddingDetails.events;
    const [selectedEvent, setSelectedEvent] = useState(events[0]);

    // An AI suggestion doesn't have a persistent ID, so we use its website as a unique key
    const uniqueId = vendor.website;
    const selectedVendorInfo = isVendorSelected(uniqueId);
    const isSelected = !!selectedVendorInfo;

    const handleSelectClick = async () => {
        if (isSelected) {
            await removeVendor(uniqueId);
            toast({ title: "Vendor Removed", description: `${vendor.vendorName} has been removed from your list.` });
        } else {
            const vendorToSave = {
                id: uniqueId, // use website as ID
                name: vendor.vendorName,
                category: vendor.vendorType,
                priceRange: 'N/A', // Not provided by search
                location: 'N/A', // Not parsed, could be added
                imageUrl: vendor.imageUrl,
                description: vendor.description,
                contact: { website: vendor.website },
                event: selectedEvent
            };
            await addVendor(vendorToSave);
            toast({ title: "Vendor Saved!", description: `${vendor.vendorName} has been added to 'My Vendors' for ${selectedEvent}.` });
        }
    };

    return (
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative w-full h-48 bg-muted">
                <Image 
                    src={vendor.imageUrl || `https://placehold.co/600x400.png`}
                    alt={`Image for ${vendor.vendorName}`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="vendor professional"
                />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">{vendor.vendorName}</CardTitle>
              <CardDescription className="text-sm font-semibold text-accent">{vendor.vendorType}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <p className="text-sm text-foreground leading-relaxed">{vendor.description}</p>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
                {isSelected ? (
                    <div className="flex items-center justify-center text-sm font-semibold p-2 bg-green-100 text-green-800 rounded-md">
                        <PartyPopper className="h-4 w-4 mr-2"/>
                        Saved for {selectedVendorInfo?.event}
                    </div>
                ) : (
                    <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select event to save for..." />
                        </SelectTrigger>
                        <SelectContent>
                            {events.map(e => <SelectItem key={e} value={e}>Save for {e}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
                <div className="flex gap-2">
                    <Button asChild className="w-full" variant="outline">
                        <Link href={vendor.website} target="_blank" rel="noopener noreferrer">
                            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button 
                        variant={isSelected ? 'destructive' : 'default'} 
                        className="w-full"
                        onClick={handleSelectClick}
                        disabled={!selectedEvent && !isSelected}
                    >
                        <Heart className={`mr-2 h-4 w-4 ${isSelected ? 'fill-current' : ''}`} />
                        {isSelected ? 'Remove' : 'Save'}
                    </Button>
                </div>
            </CardFooter>
          </Card>
    )
}


export default function VendorAISuggestionResults({ suggestions, isLoading, message }: VendorAISuggestionResultsProps) {
  if (isLoading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Searching the web for the best vendors...</p>
        </div>
      </Card>
    );
  }
  
  if (!suggestions || suggestions.length === 0) {
    return (
       <Card className="min-h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
                <InfoIcon className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Awaiting Your Command</h3>
                <p>{message || "Describe what you're looking for to get started."}</p>
            </div>
       </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-headline text-center text-foreground">
        <CheckCircle className="inline-block mr-3 h-8 w-8 text-green-500" />
        Here are your AI-powered vendor suggestions!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((vendor, index) => (
          <VendorSuggestionCard key={vendor.website || index} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
