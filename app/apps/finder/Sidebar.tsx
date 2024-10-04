import React, { useEffect } from "react";
import { useStyles } from "@os/hooks/useStyles";
import { File, Folder, Tree } from "@fc/ui/file-tree";
import { useFinderStore } from "@os/hooks/useFinderStore";
import { useAppStore } from "@os/store/appStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@fc/ui/context-menu";
import { FolderPlus, FilePlus } from "lucide-react";

const Sidebar: React.FC = () => {
  const { getColor, getFont } = useStyles();
  const { sidebarItems, fetchItems, toggleFolder, createItem } =
    useFinderStore();
  const { updateAppState } = useAppStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFolderToggle = (folderId: string) => {
    toggleFolder(folderId);
    updateAppState("finder", {
      lastModified: Date.now(),
      toggledFolder: folderId,
    });
  };

  const handleCreateItem = async (
    type: "folder" | "file",
    parentId: string | null = null
  ) => {
    const itemName = prompt(`Enter ${type} name:`);
    if (itemName) {
      await createItem(itemName, type, parentId);
      updateAppState("finder", { lastModified: Date.now() });
    }
  };

  const FolderWithContextMenu: React.FC<{
    item: any;
    children: React.ReactNode;
  }> = ({ item, children }) => (
    <ContextMenu>
      <ContextMenuTrigger>
        <Folder
          key={item.id}
          element={item.name}
          value={item.id}
          openIcon={
            <img
              src="/icns/_folder_open.svg"
              alt="Open Folder"
              className="w-4 h-4"
            />
          }
          closeIcon={
            <img
              src="/icns/_folder.svg"
              alt="Closed Folder"
              className="w-4 h-4"
            />
          }
          onToggle={() => handleFolderToggle(item.id)}
        >
          {children}
        </Folder>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleCreateItem("folder", item.id)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          <span>New Folder</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleCreateItem("file", item.id)}>
          <FilePlus className="mr-2 h-4 w-4" />
          <span>New File</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="w-[200px] overflow-y-auto h-full"
          style={{
            backgroundColor: getColor("Black"),
            color: getColor("Text Primary (Hd)"),
            fontFamily: getFont("Text Primary"),
          }}
        >
          <Tree
            className="p-2"
            initialExpandedItems={["1", "4"]}
            elements={sidebarItems}
          >
            {sidebarItems.map((item) => (
              <FolderWithContextMenu key={item.id} item={item}>
                {item.children?.map((child) => (
                  <File key={child.id} value={child.id}>
                    <p>{child.name}</p>
                  </File>
                ))}
              </FolderWithContextMenu>
            ))}
          </Tree>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleCreateItem("folder")}>
          <FolderPlus className="mr-2 h-4 w-4" />
          <span>New Root Folder</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleCreateItem("file")}>
          <FilePlus className="mr-2 h-4 w-4" />
          <span>New Root File</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Sidebar;
