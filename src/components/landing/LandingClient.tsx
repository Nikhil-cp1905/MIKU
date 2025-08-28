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

  // ✅ Rules popup state
  const [showRules, setShowRules] = React.useState(true);

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

  const onSubmit = async (values: any) => {
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
    <>
      {/* ✅ Rules Popup */}
      {showRules && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
    <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] p-8 rounded-2xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-blue-600">📘</span> Quiz Rules
        </h2>
      </div>

      {/* Rules List */}
      <ul className="list-disc pl-6 text-gray-700 space-y-3 flex-1 overflow-y-auto">
        <li className="leading-relaxed">
          ⏱ You will have <span className="font-semibold">30 seconds</span> for each question.
        </li>
        <li className="leading-relaxed">
          🚫 If you switch tabs, the current question will be skipped.
        </li>
        <li className="leading-relaxed">
          🔒 You cannot go back to previous questions after time is up.
        </li>
        <li className="leading-relaxed">
          ⏳ Once time is up, the next question will automatically load.
        </li>
        <li className="leading-relaxed">
          ⚠️ Do not refresh or leave the page during the quiz.
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowRules(false)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
)}


      {/* ✅ Existing Form */}
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
                    {isEmailValidating && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
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
                    {isRaValidating && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
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
    </>
  );
}

