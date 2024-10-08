import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@fc/ui/context-menu";
import { FolderPlus, FilePlus, Edit, Trash } from "lucide-react";

interface FinderContextMenuProps {
  children: React.ReactNode;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

export const FinderContextMenu: React.FC<FinderContextMenuProps> = ({
  children,
  onCreateFolder,
  onCreateFile,
  onRename,
  onDelete,
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
        {onRename && (
          <ContextMenuItem onClick={onRename}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </ContextMenuItem>
        )}
        {onDelete && (
          <ContextMenuItem onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
