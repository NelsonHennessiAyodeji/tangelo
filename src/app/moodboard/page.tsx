"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SparklesIcon, Wand2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getAIMoodboard, type MoodboardFormState } from "@/actions/aiActions";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoodboardPage() {
  const [state, formAction, isPending] = useActionState<
    MoodboardFormState,
    FormData
  >(getAIMoodboard, { message: "" });

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Moodboard Generator"
        description="Describe your dream wedding, and let our AI find real-world visual inspiration for you."
        icon={Wand2}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-xl">
            <form action={formAction}>
              <CardHeader>
                <CardTitle className="font-headline">Your Vision</CardTitle>
                <CardDescription>
                  Be descriptive! Mention colors, styles (e.g., rustic, modern,
                  traditional), flowers, and the overall feeling you want to
                  create.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Dream Wedding Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="e.g., 'A romantic, rustic outdoor wedding at sunset with fairy lights, lots of eucalyptus greenery, and accents of dusty rose and gold...'"
                    rows={8}
                    required
                    defaultValue={state.fields?.description}
                  />
                  {state.errors?.description?.map((error, i) => (
                    <p key={i} className="text-sm text-destructive">
                      {error}
                    </p>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending
                    ? "Searching for inspiration..."
                    : "Create My Moodboard"}
                  <SparklesIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="min-h-[500px] shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline">Your Moodboard</CardTitle>
              <CardDescription>
                {state.message && !state.data
                  ? state.message
                  : "Images found on the web will appear here."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                </div>
              ) : state.data?.images ? (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in-50 duration-500">
                  {state.data.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-full rounded-lg overflow-hidden shadow-md group"
                    >
                      <Image
                        src={image.url}
                        alt={image.prompt}
                        layout="fill"
                        objectFit="cover"
                        className="bg-secondary"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {image.prompt}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
                  <Wand2 className="h-16 w-16 mb-4" />
                  <p>Your visual inspiration awaits.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
