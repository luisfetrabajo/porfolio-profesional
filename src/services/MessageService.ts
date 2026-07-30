import { apiClient } from "../config/api";
import { Mensaje } from "../types";

export class MessageService {
  static async getAll(): Promise<Mensaje[]> {
    return apiClient.get<Mensaje[]>("/messages");
  }

  static async getUnreadCount(): Promise<number> {
    const { count } = await apiClient.get<{ count: number }>(
      "/messages?unread=true",
    );
    return count;
  }

  static async send(
    message: Omit<Mensaje, "_id" | "id" | "leido" | "created_at">,
  ): Promise<Mensaje> {
    return apiClient.post<Mensaje>("/messages", message);
  }

  static async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/messages?id=${id}`, { leido: true });
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/messages?id=${id}`);
  }
}
