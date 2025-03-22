
// Mock API client for demonstration purposes
// This would be replaced with actual API client in production

class ApiClient {
  async get(endpoint: string) {
    console.log(`GET request to ${endpoint}`);
    // Mock response for documents endpoint
    if (endpoint === "/documents") {
      return {
        data: [
          {
            id: "doc-1742610893170",
            name: "Sample Agreement",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
      };
    }
    
    // Mock response for specific document
    if (endpoint.startsWith("/documents/")) {
      const id = endpoint.split("/").pop();
      return {
        data: {
          id: id || "",
          name: "Sample Agreement",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "signed",
          parties: ["Company A", "Company B"]
        }
      };
    }
    
    return { data: [] };
  }

  async post(endpoint: string, data: any, config?: any) {
    console.log(`POST request to ${endpoint}`, data, config);
    // Mock response
    if (endpoint === "/documents") {
      return {
        data: {
          id: `doc-${Date.now()}`,
          name: data.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data
        }
      };
    }
    return { data: {} };
  }
}

export const api = new ApiClient();
