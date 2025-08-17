"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuizDispatch, useQuizState } from "@/context/QuizProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { validateField } from "@/app/actions";
import { Loader2 } from "lucide-react";
import React from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  raNumber: z.string().min(10, {
    message: "RA Number must be at least 10 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
});

export function LandingClient() {
  const { quizStatus } = useQuizState();
  const dispatch = useQuizDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [isEmailValidating, setIsEmailValidating] = React.useState(false);
  const [isRaValidating, setIsRaValidating] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      raNumber: "",
      phone: "",
    },
  });

  const handleValidation = async (
    fieldType: "SRM Email ID" | "RA Number",
    value: string
  ) => {
    if (!value) return;

    if (fieldType === "SRM Email ID") setIsEmailValidating(true);
    if (fieldType === "RA Number") setIsRaValidating(true);

    const result = await validateField({ fieldType, fieldValue: value });

    if (!result.isValid) {
      const fieldName = fieldType === "SRM Email ID" ? "email" : "raNumber";
      form.setError(fieldName, {
        type: "manual",
        message: result.reason || "Invalid format.",
      });
    }

    if (fieldType === "SRM Email ID") setIsEmailValidating(false);
    if (fieldType === "RA Number") setIsRaValidating(false);
  };

  const onSubmit = async (values: FormValues) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        srm_email: values.email,
        ra_number: values.raNumber,
        phone_number: values.phone,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "Error",
        description: result.error || "Registration failed",
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: "REGISTER_USER", payload: values });
    dispatch({ type: "START_QUIZ" });

    toast({
      title: "Success!",
      description: "You are registered. The quiz will now begin.",
    });

    router.push("/quiz");
  } catch (err: any) {
    console.error("Error:", err);
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
};


  const isQuizActive = quizStatus === "active";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SRM Email ID</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="john_doe@srmist.edu.in"
                    {...field}
                    onBlur={(e) => handleValidation("SRM Email ID", e.target.value)}
                  />
                  {isEmailValidating && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="raNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RA Number</FormLabel>
              <FormControl>
                <div className="relative">
                <Input
                  placeholder="RA2111003010123"
                  {...field}
                  onBlur={(e) => handleValidation("RA Number", e.target.value)}
                />
                {isRaValidating && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={!isQuizActive || form.formState.isSubmitting}
        >
          {isQuizActive ? "Start Quiz" : "Quiz Not Active"}
        </Button>
      </form>
    </Form>
  );
}
