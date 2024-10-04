import React, { useEffect } from "react";
import { useStyles } from "@os/hooks/useStyles";
import { File, Folder, Tree } from "@fc/ui/file-tree";
import { useFinderStore } from "@os/hooks/useFinderStore";
import { useAppStore } from "@os/store/appStore";
import { FinderContextMenu } from "./components/FinderContextMenu";

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
      try {
        await createItem(itemName, type, parentId);
        updateAppState("finder", { lastModified: Date.now() });
        fetchItems(); // Refresh the sidebar items
      } catch (error) {
        console.error(`Error creating ${type}:`, error);
        alert(`Failed to create ${type}. Please try again.`);
      }
    }
  };

  const renderFolder = (item: any) => (
    <FinderContextMenu
      key={item.id}
      onCreateFolder={() => handleCreateItem("folder", item.id)}
      onCreateFile={() => handleCreateItem("file", item.id)}
    >
      <Folder
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
        {item.children?.map((child: any) =>
          child.type === "folder" ? renderFolder(child) : renderFile(child)
        )}
      </Folder>
    </FinderContextMenu>
  );

  const renderFile = (item: any) => (
    <File key={item.id} value={item.id}>
      <p>{item.name}</p>
    </File>
  );

  return (
    <FinderContextMenu
      onCreateFolder={() => handleCreateItem("folder")}
      onCreateFile={() => handleCreateItem("file")}
    >
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
          {sidebarItems.map((item) =>
            item.type === "folder" ? renderFolder(item) : renderFile(item)
          )}
        </Tree>
      </div>
    </FinderContextMenu>
  );
};

export default Sidebar;
