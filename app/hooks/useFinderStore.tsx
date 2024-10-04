import { create } from "zustand";
import { Folder, File } from "@prisma/client";

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
  createItem: (
    name: string,
    type: "file" | "folder",
    parentId: string | null,
    content?: string,
    size?: number
  ) => Promise<void>;
  renameItem: (
    id: string,
    name: string,
    type: "file" | "folder"
  ) => Promise<void>;
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
      const response = await fetch(`/api/finder/${folderId || "root"}`);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();

      const mapToFinderItem = (
        item: FolderWithRelations | File
      ): FinderItem => ({
        id: item.id,
        name: item.name,
        type: "files" in item ? "folder" : "file",
        parentId:
          "parentId" in item
            ? item.parentId
            : "folderId" in item
            ? item.folderId
            : null,
        isRoot: "isRoot" in item ? item.isRoot : false,
        children:
          "files" in item
            ? [...item.subfolders, ...item.files].map((child) =>
                mapToFinderItem(child as FolderWithRelations | File)
              )
            : undefined,
      });

      const rootItem = mapToFinderItem(data as FolderWithRelations);

      set({
        sidebarItems: [rootItem],
        contentItems: rootItem.children || [],
        currentFolderId: folderId || data.id,
        isLoading: false,
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
        const currentFolder = get().contentItems.find((item) => item.id === id);
        await fetchItems(currentFolder?.parentId ?? null);
      } else {
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
      const response = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, parentId, content, size }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create item");
      }
      const newItem = await response.json();

      // Update the local state with the new item
      set((state) => {
        const updateItems = (items: FinderItem[]): FinderItem[] => {
          return items.map((item) => {
            if (item.id === parentId || (item.isRoot && !parentId)) {
              return {
                ...item,
                children: [
                  ...(item.children || []),
                  {
                    id: newItem.id,
                    name: newItem.name,
                    type: type,
                    parentId: newItem.parentId || newItem.folderId,
                    isRoot: false,
                    children: type === "folder" ? [] : undefined,
                  },
                ],
              };
            }
            if (item.children) {
              return { ...item, children: updateItems(item.children) };
            }
            return item;
          });
        };

        const updatedSidebarItems = updateItems(state.sidebarItems);
        const updatedContentItems =
          parentId === state.currentFolderId ||
          (!parentId && state.currentFolderId === "root")
            ? [
                ...state.contentItems,
                {
                  id: newItem.id,
                  name: newItem.name,
                  type: type,
                  parentId: newItem.parentId || newItem.folderId,
                  isRoot: false,
                  children: type === "folder" ? [] : undefined,
                },
              ]
            : state.contentItems;

        return {
          sidebarItems: updatedSidebarItems,
          contentItems: updatedContentItems,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Error creating item:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  renameItem: async (id, name, type) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/finder/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to rename item");
      }
      // Refetch items to update the view
      await get().fetchItems(get().currentFolderId);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error renaming item:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteItem: async (id, type) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/finder/${id}?type=${type}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }
      // Refetch items to update the view
      await get().fetchItems(get().currentFolderId);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error deleting item:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
