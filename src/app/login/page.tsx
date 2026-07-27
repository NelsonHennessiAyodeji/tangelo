"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogInIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // In a demo app, we just simulate a successful login by redirecting.
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Log In to Your Account"
        description="Welcome back! Access your wedding planning dashboard."
        icon={LogInIcon}
      />
      <Card className="max-w-md mx-auto shadow-xl text-center">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Demo Access</CardTitle>
          <CardDescription>
            Click the button below to log in to the demo account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full" size="lg">
            <LogInIcon className="mr-2 h-5 w-5" />
            Log In as Demo User
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
