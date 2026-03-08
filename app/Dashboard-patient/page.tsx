import { redirect } from "next/navigation";

export default function LegacyPatientDashboardRoute() {
  redirect("/dashboard/patient");
}
