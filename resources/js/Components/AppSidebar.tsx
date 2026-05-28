import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/Components/ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <SidebarMenu className="text-center">
          <SidebarMenuItem>Where2Buy</SidebarMenuItem>
          <SidebarMenuItem className="text-gray-600">Find where to buy your items!</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <p className="text-gray-600"></p>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-sm text-gray-500">&copy; Where2Buy</p>
      </SidebarFooter>
    </Sidebar>
  )
}
