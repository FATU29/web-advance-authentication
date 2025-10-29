const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface RegisterData {
  email: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const registerUser = async (
  data: RegisterData
): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return response.json();
};
