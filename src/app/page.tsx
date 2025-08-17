import { LandingClient } from "@/components/landing/LandingClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            QuizTime
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Embedded Systems Quiz
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>
              Please fill out the form to start the quiz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LandingClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
