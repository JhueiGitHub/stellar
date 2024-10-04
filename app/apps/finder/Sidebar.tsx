import React, { useEffect } from "react";
import { useStyles } from "@os/hooks/useStyles";
import { File, Folder, Tree } from "@fc/ui/file-tree";
import { useFinderStore } from "@os/hooks/useFinderStore";
import { useAppStore } from "@os/store/appStore";
import { FinderContextMenu } from "./components/FinderContextMenu";

const Sidebar: React.FC = () => {
  const { getColor, getFont } = useStyles();
  const {
    sidebarItems,
    fetchItems,
    toggleFolder,
    createItem,
    renameItem,
    deleteItem,
  } = useFinderStore();
  const { updateAppState } = useAppStore();

  // Fetch root items on component mount
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
      } catch (error) {
        console.error(`Error creating ${type}:`, error);
        alert(`Failed to create ${type}. Please try again.`);
      }
    }
  };

  const handleRenameItem = async (id: string, type: "folder" | "file") => {
    const newName = prompt(`Enter new name for ${type}:`);
    if (newName) {
      try {
        await renameItem(id, newName, type);
        updateAppState("finder", { lastModified: Date.now() });
      } catch (error) {
        console.error(`Error renaming ${type}:`, error);
        alert(`Failed to rename ${type}. Please try again.`);
      }
    }
  };

  const handleDeleteItem = async (id: string, type: "folder" | "file") => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${type}?`
    );
    if (confirmDelete) {
      try {
        await deleteItem(id, type);
        updateAppState("finder", { lastModified: Date.now() });
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Failed to delete ${type}. Please try again.`);
      }
    }
  };

  const renderItem = (item: any) => (
    <FinderContextMenu
      key={item.id}
      onCreateFolder={() => handleCreateItem("folder", item.id)}
      onCreateFile={() => handleCreateItem("file", item.id)}
      onRename={() => handleRenameItem(item.id, item.type)}
      onDelete={() => handleDeleteItem(item.id, item.type)}
    >
      {item.type === "folder" ? (
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
          {item.children?.map((child: any) => renderItem(child))}
        </Folder>
      ) : (
        <File key={item.id} value={item.id}>
          <p>{item.name}</p>
        </File>
      )}
    </FinderContextMenu>
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
          {sidebarItems.map(renderItem)}
        </Tree>
      </div>
    </FinderContextMenu>
  );
};

export default Sidebar;
