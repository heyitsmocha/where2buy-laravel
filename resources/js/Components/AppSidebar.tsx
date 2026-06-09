import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/Components/ui/sidebar";

import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

import { LuLogIn, LuLogOut } from "react-icons/lu";
import { MdHome, MdListAlt } from "react-icons/md";

import { usePage, router } from "@inertiajs/react";
import type { SharedProps } from "@/Types/types";

interface AppSidebarProps {
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function AppSidebar({ onLoginClick, onLogoutClick }: AppSidebarProps) {
  const { auth } = usePage<SharedProps>().props;
  const isLoggedIn = auth.user != null;

  const { url } = usePage();

  const isUrlActive = (path: string) => {
    return url === path;
  }

  return (
    <Sidebar collapsible="icon" className="pt-2">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="h-9">
              <SidebarMenuButton isActive={isUrlActive("/")} tooltip="Home" asChild>
                <Link href="/">
                  <MdHome className="inline-block mr-2" />
                  <span className="group-data-[collapsible=icon]:hidden">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className={`h-9 ${isLoggedIn ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
              <SidebarMenuButton isActive={isUrlActive("/inquiries/me")} tooltip="My Inquiries" asChild>
                <div onClick={isLoggedIn ? () => router.get("/inquiries/me") : undefined}>
                  <MdListAlt className="inline-block mr-2" />
                  <span className="group-data-[collapsible=icon]:hidden">My Inquiries</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu className="group-data-[collapsible=icon]:hidden">
          <SidebarMenuItem>
            {isLoggedIn ? (auth.user.name) : 'Guest'}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant="outline" onClick={isLoggedIn ? onLogoutClick : onLoginClick} className={`cursor-pointer justify-center ${isLoggedIn ? "bg-red-500 hover:bg-red-600" : "bg-fuchsia-700 hover:bg-fuchsia-600 active:bg-fuchsia-800 text-white hover:text-white active:text-white"}`}>
              {/* <Button onClick={isLoggedIn ? onLogoutClick : onLoginClick} className={`cursor-pointer ${isLoggedIn ? "bg-red-500 hover:bg-red-600" : "hover:bg-fuchsia-600 active:bg-fuchsia-800"}`}> */}
              {isLoggedIn ? <LuLogOut /> : <LuLogIn />}
              <span className="group-data-[collapsible=icon]:hidden">{isLoggedIn ? "Logout" : "Login"}</span>
              {/* </Button> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <p className="text-sm text-gray-500">&copy; Where2Buy</p> */}
      </SidebarFooter>
    </Sidebar>
  )
}
