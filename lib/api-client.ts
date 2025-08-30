// lib/api-clients.ts
import { VideoInterface } from "@/models/Video"; // Correct import

export type VideoFormData = Omit<VideoInterface, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || responseData.error || response.statusText;
        throw new Error(`HTTP ${response.status}: ${errorMessage}`);
      }

      return responseData;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getVideos(): Promise<VideoInterface[]> {
    return this.fetch<VideoInterface[]>("/video");
  }

  async createVideo(videoData: VideoFormData): Promise<VideoInterface> {
    return this.fetch<VideoInterface>("/video", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();