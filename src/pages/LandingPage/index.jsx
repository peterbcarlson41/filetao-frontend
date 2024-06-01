import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dashboardImage from "@/assets/Dashboard.png";
import statisticsDashboardImage from "@/assets/StatisticsDashboard.png";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const statisticsURL = import.meta.env.VITE_STATISTICS_URL;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-10">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure and Decentralized File Storage
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    FileTao is a web3 file storage service that offers
                    decentralized, encrypted, and cross-chain storage solutions
                    for your digital assets.
                  </p>
                </div>
                <div>
                  <Button onClick={() => navigate("/register")}>
                    Get Started
                  </Button>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-video rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src={dashboardImage}
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    View Miner Information
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    View live statistics for miners on the network.
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => (window.location.href = statisticsURL)}
                  >
                    View Live Dashboard
                  </Button>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-video rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src={statisticsDashboardImage}
                width="550"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 FileTao. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
