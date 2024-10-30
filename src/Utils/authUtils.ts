import { jwtDecode } from "jwt-decode";

export function isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
}

export function getUserRole(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])); 

    return payload.userWithoutPassword ? payload.userWithoutPassword.role : null; 
}

export const getUserId = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decodedToken = jwtDecode<{ userWithoutPassword: { id: number } }>(token);        
        return decodedToken.userWithoutPassword.id || null; 
    } catch (error) {
        console.error("Failed to decode token from local storage", error);
        return null; 
    }
};
