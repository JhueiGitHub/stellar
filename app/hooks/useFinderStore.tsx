import { create } from "zustand";
import { Folder, File } from "@prisma/client";

// Define types for items with relations
type FolderWithRelations = Folder & {
  subfolders: Folder[];
  files: File[];
};

interface FinderItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FinderItem[];
  parentId: string | null;
  isRoot: boolean;
}

interface FinderState {
  sidebarItems: FinderItem[];
  contentItems: FinderItem[];
  currentFolderId: string | null;
  selectedItemId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchItems: (folderId?: string | null) => Promise<void>;
  selectItem: (id: string) => void;
  toggleFolder: (id: string) => Promise<void>;
  createItem: (name: string, type: "file" | "folder", parentId: string | null, content?: string, size?: number) => Promise<void>;
  renameItem: (id: string, name: string, type: "file" | "folder") => Promise<void>;
  deleteItem: (id: string, type: "file" | "folder") => Promise<void>;
}

export const useFinderStore = create<FinderState>((set, get) => ({
  sidebarItems: [],
  contentItems: [],
  currentFolderId: null,
  selectedItemId: null,
  isLoading: false,
  error: null,

  fetchItems: async (folderId) => {
    set({ isLoading: true, error: null });
    try {
      // Use the new API route to fetch items
      const response = await fetch(`/api/finder/${folderId || 'root'}`);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();

      // Map the API response to FinderItem structure
      const mapToFinderItem = (item: FolderWithRelations | File): FinderItem => ({
        id: item.id,
        name: item.name,
        type: 'files' in item ? "folder" : "file",
        parentId: 'parentId' in item ? item.parentId : ('folderId' in item ? item.folderId : null),
        isRoot: 'isRoot' in item ? item.isRoot : false,
        children: 'files' in item 
          ? [...item.subfolders, ...item.files].map(child => mapToFinderItem(child as FolderWithRelations | File))
          : undefined,
      });

      const rootItem = mapToFinderItem(data as FolderWithRelations);
      
      set({ 
        sidebarItems: [rootItem],
        contentItems: rootItem.children || [],
        currentFolderId: folderId || data.id,
        isLoading: false 
      });
    } catch (error) {
      console.error("Error fetching items:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectItem: (id) => set({ selectedItemId: id }),

  toggleFolder: async (id) => {
    const { fetchItems, currentFolderId } = get();
    set({ isLoading: true, error: null });
    try {
      if (id === currentFolderId) {
        // If clicking on the current folder, navigate to its parent
        const currentFolder = get().contentItems.find(item => item.id === id);
        await fetchItems(currentFolder?.parentId ?? null);
      } else {
        // Otherwise, open the clicked folder
        await fetchItems(id);
      }
    } catch (error) {
      console.error("Error toggling folder:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createItem: async (name, type, parentId, content = "", size = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, parentId, content, size }),
      });
      if (!response.ok) throw new Error("Failed to create item");
      // Refetch items to update the view
      await get().fetchItems(parentId);
    } catch (error) {
      console.error("Error creating item:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  renameItem: async (id, name, type) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/finder/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      if (!response.ok) throw new Error("Failed to rename item");
      // Refetch items to update the view
      await get().fetchItems(get().currentFolderId);
    } catch (error) {
      console.error("Error renaming item:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteItem: async (id, type) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/finder/${id}?type=${type}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Failed to delete item");
      // Refetch items to update the view
      await get().fetchItems(get().currentFolderId);
    } catch (error) {
      console.error("Error deleting item:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));