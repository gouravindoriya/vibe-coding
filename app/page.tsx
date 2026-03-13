"use client";

import { useState } from "react";
import HREmailForm from "@/components/HREmailForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <main className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HR Mail Service
          </h1>
          <p className="text-gray-500 text-sm">
            Automate your job application emails to HR
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Send Email to HR
            </h2>
            <button
              onClick={() => setDialogOpen(true)}
              className="text-xs text-blue-600 hover:underline focus:outline-none"
            >
              How it works?
            </button>
          </div>

          <HREmailForm onSuccess={() => setDialogOpen(false)} />
        </div>

        {/* Info Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How the HR Mail Service Works</DialogTitle>
              <DialogDescription>
                Automate your job application email process in a few steps.
              </DialogDescription>
            </DialogHeader>
            <ol className="mt-4 space-y-3 text-sm text-gray-600 list-decimal list-inside">
              <li>Fill in the HR email address and your details.</li>
              <li>Enter the position you are applying for.</li>
              <li>Write your message and click &quot;Send Email to HR&quot;.</li>
              <li>
                The service sends a formatted email on your behalf automatically.
              </li>
            </ol>
            <button
              onClick={() => setDialogOpen(false)}
              className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors"
            >
              Close
            </button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
