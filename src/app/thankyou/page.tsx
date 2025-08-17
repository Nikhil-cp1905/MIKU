// src/app/thankyou/page.tsx
export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-4">
      <h1 className="text-3xl font-bold text-green-700">Thank You!</h1>
      <p className="text-lg">You have successfully completed the quiz.</p>
      <p className="text-md">You can now proceed with the coding round.</p>
    </div>
  );
}

