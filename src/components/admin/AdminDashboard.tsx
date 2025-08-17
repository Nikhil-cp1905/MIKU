"use client";

import { useQuizDispatch, useQuizState } from "@/context/QuizProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "../ui/button";
import { Download, Trash2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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

export function AdminDashboard() {
  const { quizStatus, participants } = useQuizState();
  const dispatch = useQuizDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const handleQuizToggle = () => {
    dispatch({ type: "TOGGLE_QUIZ_STATUS" });
  };

  const handleExport = () => {
    if (participants.length === 0) {
      toast({
        title: "No Data",
        description: "There is no participant data to export.",
        variant: "destructive",
      });
      return;
    }
    const headers = [
      "Name",
      "Email",
      "RA Number",
      "Phone",
      "Score",
      "Time Taken (s)",
    ];
    const rows = participants.map((p) =>
      [p.name, p.email, p.raNumber, p.phone, p.score, p.timeTaken].map(String)
    );

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quiz_participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = () => {
    dispatch({ type: "CLEAR_PARTICIPANTS" });
    toast({
      title: "Success",
      description: "All participant data has been cleared.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    router.push("/admin/login");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quiz Control</CardTitle>
          <CardDescription>
            Use the toggle below to start or stop the quiz for all users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Quiz Status:{" "}
                <span
                  className={
                    quizStatus === "active" ? "text-green-600" : "text-red-600"
                  }
                >
                  {quizStatus === "active" ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                When active, users can start the quiz from the landing page.
              </p>
            </div>
            <Switch
              checked={quizStatus === "active"}
              onCheckedChange={handleQuizToggle}
              aria-readonly
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              A list of all users who have completed the quiz.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} disabled={participants.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={participants.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all participant data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={participants} />
        </CardContent>
      </Card>
    </div>
  );
}
