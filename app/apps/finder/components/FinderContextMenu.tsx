import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@fc/ui/context-menu";
import { FolderPlus, FilePlus } from "lucide-react";

interface FinderContextMenuProps {
  children: React.ReactNode;
  onCreateFolder: () => void;
  onCreateFile: () => void;
}

export const FinderContextMenu: React.FC<FinderContextMenuProps> = ({
  children,
  onCreateFolder,
  onCreateFile,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onCreateFolder}>
          <FolderPlus className="mr-2 h-4 w-4" />
          <span>New Folder</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCreateFile}>
          <FilePlus className="mr-2 h-4 w-4" />
          <span>New File</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
