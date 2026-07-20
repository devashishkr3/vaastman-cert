"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import type { Navbar1Props } from "./types";
import { getInitials, getMenuItems } from "./utils";

function Navbar1({
  logo = {
    url: "/home",
    src: "/vaastman-logo.jpg",
    alt: "Vaastman Solutions logo",
    title: "Vaastman",
  },
  menu = [
    { title: "Candidate Registration", url: "/add/candidate" },
    { title: "Verify Certificate", url: "/verify/internship" },
    { title: "Download Certificate", url: "/download/internship" },
    { title: "Sign In", url: "/signin" },
  ],
  auth = {
    signin: { title: "Sign In", url: "/signin" },
  },
}: Navbar1Props) {
  const router = useRouter();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const { data: session } = authClient.useSession();

  const menuItems = getMenuItems(menu, auth.signin.url, session?.user.role);

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/signin");
            router.refresh();
          },
        },
      });
    });
  };

  return (
    <section className="mx-auto w-[90%] py-4">
      <div className="container">
        <DesktopNav
          auth={auth}
          getInitials={getInitials}
          isLoggingOut={isLoggingOut}
          logo={logo}
          menuItems={menuItems}
          onLogout={handleLogout}
          session={session ?? null}
        />
        <MobileNav
          auth={auth}
          getInitials={getInitials}
          isLoggingOut={isLoggingOut}
          logo={logo}
          menuItems={menuItems}
          onLogout={handleLogout}
          session={session ?? null}
        />
      </div>
    </section>
  );
}

export { Navbar1 };
