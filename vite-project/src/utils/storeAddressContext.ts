

interface ContextObject {
    name: string
    address: string
}

export function storeAddressContext(array: ContextObject) {
    //1 fetch localStorage, push new array to localStorage array then replace
    const parsedArray = JSON.parse(localStorage.getItem("users") || "[]")
    parsedArray.push(array)
    localStorage.setItem("users", JSON.stringify(parsedArray))
    return parsedArray
}

export function initialState() {
    const getIt = JSON.parse(localStorage.getItem("users") || "[]")
    return getIt
}