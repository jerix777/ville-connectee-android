
import { AppShell } from "@/components/layout/AppShell";
import { HeroSection } from "@/components/common/HeroSection";
import { ServicesGrid } from "@/components/common/ServicesGrid";

export default function IndexPage() {
  return (
    <>
      <HeroSection />
      <AppShell>
        <ServicesGrid />
      </AppShell>
    </>
  );
}
