import BackgroundLines from "./extras/BackgroundLines"
import CheckoutForm from "../payment/CheckoutForm"

export default function CheckoutPage() {
    return (
        <main className="bg-zinc-950">
            <BackgroundLines />
            <div id="heroGradient" className="hero-gradient" />
            <CheckoutForm></CheckoutForm>
        </main>
    )
}