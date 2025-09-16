// app/assessment-result/page.tsx
import { Suspense } from "react";
import Navbar from "../components/Navbar";
import AssessmentResultClient from "./AssessmentResultClient";

export default function AssessmentResultPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading your results...</div>}>
        <AssessmentResultClient />
      </Suspense>
    </>
  );
}
