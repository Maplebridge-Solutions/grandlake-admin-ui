import apiClient from "@/lib/client";

interface ApiResponse {
  success: boolean;
  message: string;
}

export const deleteAccount = async (): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>("auth/delete-me");
  return response.data;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<ApiResponse> => {
  const response = await apiClient.patch<ApiResponse>("auth/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};

export const verifyOtp = async (otpCode: string): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "auth/me/verify-email-otp",
    { otpCode },
  );
  return response.data;
};

export const resendOtp = async (): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>("auth/me/send-email-otp");
  return response.data;
};

export const sendForgotPasswordOtp = async (
  emailAddress: string,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    `auth/me/send-email-otp?forgotPassword=true&emailAddress=${emailAddress}`,
  );
  return response.data;
};

export const resetPassword = async ({
  otpCode,
  emailAddress,
  newPassword,
}: {
  otpCode: string;
  emailAddress: string;
  newPassword: string;
}): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>("auth/me/reset-password", {
    otpCode,
    emailAddress,
    newPassword,
  });
  return response.data;
};
