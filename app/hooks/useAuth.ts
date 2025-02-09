import { useAuth } from "@clerk/nextjs";

export default function useAuthenticatedUser() {
    const { userId, getToken } = useAuth();

    async function fetchUserData() {
        const token = await getToken();
        const response = await fetch("/api/user", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    }

    return { userId, fetchUserData };
}
