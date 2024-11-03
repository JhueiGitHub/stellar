import { AppConfigFlow, FlowNodeData } from "@/app/types/flow";

export async function fetchAppConfigFlow(
  appId: string
): Promise<AppConfigFlow | null> {
  try {
    const response = await fetch(`/api/flows/app-config/${appId}`);
    if (!response.ok) throw new Error("Failed to fetch app config");
    return await response.json();
  } catch (error) {
    console.error("Error fetching app config:", error);
    return null;
  }
}

export async function updateFlow(
  flowId: string,
  updates: { nodes?: FlowNodeData[] }
): Promise<void> {
  const response = await fetch(`/api/flows/${flowId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update flow");
  }
}

export async function createAppConfigFlow(
  appId: string,
  designSystemId: string
): Promise<AppConfigFlow> {
  const response = await fetch("/api/flows/app-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      appId,
      designSystemId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create app config flow");
  }

  return await response.json();
}
