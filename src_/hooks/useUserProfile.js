import { useQuery } from "react-query";
import axios from "axios";

export default function useUserProfile() {
    return useQuery(["profile"], async () => {
        const res = await axios.get("/api/users/me/");
        return res.data;
});
}