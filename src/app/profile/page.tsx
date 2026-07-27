import PageHeader from "@/components/PageHeader";
import {
  UserCircle,
  HeartIcon,
  BookOpenIcon,
  Users,
  LockIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockWeddingDetails } from "@/lib/mockData";
import { Separator } from "@/components/ui/separator";

const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-md text-foreground">{value || "Not set"}</p>
  </div>
);

export default async function ProfilePage() {
  const { couple, events, location } = mockWeddingDetails;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="View and update your personal and wedding information."
        icon={UserCircle}
      />
      <div className="space-y-8 max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <HeartIcon className="mr-2 h-6 w-6 text-primary" />
              Personal Details
            </CardTitle>
            <CardDescription>
              This is your demo profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="Your Name"
                value={`${couple.user.firstName} ${couple.user.lastName}`}
              />
              <InfoItem
                label="Your Partner's Name"
                value={`${couple.partner.firstName} ${couple.partner.lastName}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <BookOpenIcon className="mr-2 h-6 w-6 text-primary" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem label="Primary Event" value={events.primary} />
            <InfoItem label="Additional Event" value={events.additional} />
            <InfoItem label="Location" value={location} />
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              Share Your Plan
            </CardTitle>
            <CardDescription>
              In a full version, you could invite your partner to collaborate
              here.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <LockIcon className="mr-2 h-6 w-6 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>
              Password management is disabled in the demo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
