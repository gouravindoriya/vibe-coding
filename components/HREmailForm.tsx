"use client";

import { useState } from "react";

interface FormData {
  hrEmail: string;
  subject: string;
  applicantName: string;
  position: string;
  message: string;
}

interface FormErrors {
  hrEmail?: string;
  subject?: string;
  applicantName?: string;
  position?: string;
  message?: string;
}

interface HREmailFormProps {
  onSuccess?: () => void;
}

export default function HREmailForm({ onSuccess }: HREmailFormProps) {
  const [formData, setFormData] = useState<FormData>({
    hrEmail: "",
    subject: "",
    applicantName: "",
    position: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [apiError, setApiError] = useState<string>("");

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.hrEmail) {
      newErrors.hrEmail = "HR email is required";
    } else if (!emailRegex.test(formData.hrEmail)) {
      newErrors.hrEmail = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.applicantName.trim()) newErrors.applicantName = "Your name is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setApiError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.hrEmail,
          subject: formData.subject,
          applicantName: formData.applicantName,
          position: formData.position,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error ?? "Failed to send email. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({
        hrEmail: "",
        subject: "",
        applicantName: "",
        position: "",
        message: "",
      });
      onSuccess?.();
    } catch {
      setApiError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* HR Email */}
      <div>
        <label htmlFor="hrEmail" className="block text-sm font-medium text-gray-700 mb-1">
          HR Email <span className="text-red-500">*</span>
        </label>
        <input
          id="hrEmail"
          name="hrEmail"
          type="email"
          value={formData.hrEmail}
          onChange={handleChange}
          placeholder="hr@company.com"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.hrEmail ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.hrEmail && (
          <p className="mt-1 text-xs text-red-600">{errors.hrEmail}</p>
        )}
      </div>

      {/* Applicant Name */}
      <div>
        <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="applicantName"
          name="applicantName"
          type="text"
          value={formData.applicantName}
          onChange={handleChange}
          placeholder="John Doe"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.applicantName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.applicantName && (
          <p className="mt-1 text-xs text-red-600">{errors.applicantName}</p>
        )}
      </div>

      {/* Position */}
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
          Position Applied For <span className="text-red-500">*</span>
        </label>
        <input
          id="position"
          name="position"
          type="text"
          value={formData.position}
          onChange={handleChange}
          placeholder="e.g. Software Engineer"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.position ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.position && (
          <p className="mt-1 text-xs text-red-600">{errors.position}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Email Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Application for Software Engineer"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.subject ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Write your message to HR here..."
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.message ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      {/* API Error */}
      {status === "error" && apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {/* Success */}
      {status === "success" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✓ Email sent successfully to HR!
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {status === "loading" ? "Sending..." : "Send Email to HR"}
      </button>
    </form>
  );
}
