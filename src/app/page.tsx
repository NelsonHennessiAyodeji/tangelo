import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ListChecks,
  BrainCircuit,
  Banknote,
  Users,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="mx-auto bg-primary/20 text-primary rounded-full p-3 w-fit">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="mt-4 font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default function HomePage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-6xl font-headline text-primary font-bold">
          Plan Your Perfect Nigerian Wedding
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Tangelo is your AI-powered assistant, designed to make planning your
          dream wedding simpler, smarter, and more personal.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
        <div className="mt-16 relative w-full max-w-4xl mx-auto h-96 rounded-lg shadow-2xl overflow-hidden">
          <Image
            src="https://placehold.co/1200x600.png"
            alt="Nigerian couple smiling at their wedding"
            layout="fill"
            objectFit="cover"
            data-ai-hint="nigerian wedding"
            className="bg-secondary"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-headline text-center font-bold">
            Everything You Need in One Place
          </h2>
          <p className="text-center mt-2 text-muted-foreground">
            From budgeting to guest lists, we've got you covered.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Banknote}
              title="Smart Budgeting"
              description="Track every expense and stay on budget with our intuitive financial tools."
            />
            <FeatureCard
              icon={BrainCircuit}
              title="AI Vendor Assistant"
              description="Get personalized vendor suggestions that match your style, budget, and location in Nigeria."
            />
            <FeatureCard
              icon={Users}
              title="Guest Management"
              description="Organize your guest list, track RSVPs, and create seating charts with ease."
            />
            <FeatureCard
              icon={ListChecks}
              title="Interactive Checklist"
              description="Never miss a detail with a comprehensive, customizable wedding checklist."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-headline font-bold text-primary">
          Ready to Start Planning?
        </h2>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Create your account today and experience a stress-free wedding
          planning journey.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
