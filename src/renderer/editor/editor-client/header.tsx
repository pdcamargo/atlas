import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { EditorMenu, IMenuNode } from "@atlas/editor/editor-menu";
import { observer } from "mobx-react-lite";

function generateMenuItems(children: IMenuNode[]) {
  return children.map((child) => {
    if (child.children.length > 0) {
      // It's a submenu
      return (
        <MenubarSub key={child.id}>
          <MenubarSubTrigger>{child.label}</MenubarSubTrigger>
          <MenubarSubContent>
            {generateMenuItems(child.children)}
          </MenubarSubContent>
        </MenubarSub>
      );
    } else {
      // It's a regular menu item
      return (
        <MenubarItem key={child.id} onClick={child?.action}>
          {child.label}
        </MenubarItem>
      ); // Add action handling as needed
    }
  });
}

const DynamicMenubar = () => {
  // Assuming EditorMenu.menus provides the top-level menu structure
  const menus = EditorMenu.menus;

  return (
    <Menubar className="w-full border-none bg-nosferatu rounded-none">
      {menus.map((menu) => (
        <MenubarMenu key={menu.id}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>{generateMenuItems(menu.children)}</MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};

export const EditorHeader = observer(() => {
  return (
    <>
      <DynamicMenubar />
    </>
  );
});
