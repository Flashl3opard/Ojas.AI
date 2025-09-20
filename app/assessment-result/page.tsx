"use client";

import React, { Suspense } from "react";
import Navbar from "../components/Navbar";
import AssessmentResultClient from "./AssessmentResultClient";
import { motion } from "framer-motion";

export default function AssessmentResultPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <motion.div
          className="min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AssessmentResultClient />
        </motion.div>
      </Suspense>
    </>
  );
}
