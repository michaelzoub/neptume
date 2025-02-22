export function setJWT(token: string): boolean {
    localStorage.setItem("jwt", token)
    return true
}