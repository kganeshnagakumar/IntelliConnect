import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";
import SmoothScroll from "./SmoothScroll";

export default function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col relative bg-background">
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col relative">
        <BackgroundEffects />
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
