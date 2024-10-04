import React from "react";
import { useFinderStore } from "@os/hooks/useFinderStore";
import { useStyles } from "@os/hooks/useStyles";
import { Card, CardContent } from "@fc/ui/card";
import { FinderContextMenu } from "./components/FinderContextMenu";
import { useAppStore } from "@os/store/appStore";

const ContentArea: React.FC = () => {
  const { getColor, getFont } = useStyles();
  const { contentItems, selectItem, createItem, renameItem, deleteItem, currentFolderId } = useFinderStore();
  const { updateAppState } = useAppStore();

  const handleItemClick = (itemId: string) => {
    selectItem(itemId);
    updateAppState("finder", { lastModified: Date.now() });
  };

  const handleCreateItem = async (type: "folder" | "file") => {
    const itemName = prompt(`Enter ${type} name:`);
    if (itemName) {
      try {
        await createItem(itemName, type, currentFolderId);
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
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${type}?`);
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

  return (
    <div
      className="flex-grow p-4 overflow-y-auto"
      style={{
        backgroundColor: getColor("Underlying BG"),
        color: getColor("Text Primary (Hd)"),
        fontFamily: getFont("Text Primary"),
      }}
    >
      <div className="grid grid-cols-4 gap-4">
        {contentItems.map((item) => (
          <FinderContextMenu
            key={item.id}
            onCreateFolder={() => handleCreateItem("folder")}
            onCreateFile={() => handleCreateItem("file")}
            onRename={() => handleRenameItem(item.id, item.type)}
            onDelete={() => handleDeleteItem(item.id, item.type)}
          >
            <Card onClick={() => handleItemClick(item.id)}>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <img
                  src={item.type === "folder" ? "/icns/_folder.svg" : "/icns/_file.svg"}
                  alt={item.type}
                  className="w-12 h-12 mb-2"
                />
                <p>{item.name}</p>
              </CardContent>
            </Card>
          </FinderContextMenu>
        ))}
      </div>
    </div>
  );
};

export default ContentArea;