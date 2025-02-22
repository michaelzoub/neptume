import { useNavigate } from "react-router-dom";

export function navigatePaymentPage() {
    const navigate = useNavigate();
    navigate("/checkout")
    return true
}