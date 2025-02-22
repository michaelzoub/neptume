export function getJWT(): string {
    const jwt = localStorage.getItem("jwt");
    return (jwt || "")
}