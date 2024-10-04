import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@fc/ui/context-menu";
import { Folder, File, Plus } from "lucide-react";
import { useFinderStore } from "@os/hooks/useFinderStore";

interface FinderContextMenuProps {
  children: React.ReactNode;
  folderId: string;
}

export const FinderContextMenu: React.FC<FinderContextMenuProps> = ({
  children,
  folderId,
}) => {
  const { createItem } = useFinderStore();

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      await createItem(folderName, "folder", folderId);
    }
  };

  const handleCreateFile = async () => {
    const fileName = prompt("Enter file name:");
    if (fileName) {
      await createItem(fileName, "file", folderId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleCreateFolder}>
          <Folder className="mr-2 h-4 w-4" />
          <span>New Folder</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCreateFile}>
          <File className="mr-2 h-4 w-4" />
          <span>New File</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
