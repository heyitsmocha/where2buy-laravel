import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

interface AppSidebarProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function AppSidebar({ isLoggedIn, onLoginClick, onLogoutClick }: AppSidebarProps) {

  const { url } = usePage();

  const isUrlActive = (path: string) => {
    return url === path;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-fuchsia-200 h-32 mb-4 rounded-b-lg">
        <SidebarMenu className="pt-4">
          <SidebarMenuItem>Guest</SidebarMenuItem>
          <SidebarMenuItem>{"email goes here"}</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="p-4 cursor-pointer" isActive={isUrlActive("/")} tooltip="Home" asChild>
              <Link href="/">
                <MdHome className="inline-block mr-2" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="p-4 cursor-pointer" isActive={isUrlActive("/inquiries/me")} tooltip="My Inquiries" asChild>
              <Button variant="ghost" onClick={isLoggedIn ? () => router.get("/inquiries/me") : undefined} disabled={!isLoggedIn}>
                <MdListAlt className="inline-block mr-2" />
                <span>My Inquiries</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant="outline" onClick={isLoggedIn ? onLogoutClick : onLoginClick} className={`p-4 cursor-pointer justify-center ${isLoggedIn ? "bg-red-500 hover:bg-red-600" : "bg-fuchsia-700 hover:bg-fuchsia-600 active:bg-fuchsia-800 text-white hover:text-white active:text-white"}`}>
              {/* <Button onClick={isLoggedIn ? onLogoutClick : onLoginClick} className={`cursor-pointer ${isLoggedIn ? "bg-red-500 hover:bg-red-600" : "hover:bg-fuchsia-600 active:bg-fuchsia-800"}`}> */}
              {isLoggedIn ? <LuLogOut /> : <LuLogIn />}
              <span>{isLoggedIn ? "Logout" : "Login"}</span>
              {/* </Button> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <p className="text-sm text-gray-500">&copy; Where2Buy</p> */}
      </SidebarFooter>
    </Sidebar>
  )
}
