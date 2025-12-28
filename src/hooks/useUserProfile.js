import { useQuery } from "react-query";
import apiClient from "../services/apiClient";

export default function useUserProfile() {
    return useQuery(["profile"], async () => {
        const response = await apiClient.get("/api/users/me/");
        return response.data;
    });
}
