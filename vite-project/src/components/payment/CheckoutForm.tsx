import type React from "react"
import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { apiEndpoint } from "../../data/apiEndpoint"

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<null | string | undefined>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${apiEndpoint}`,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message)
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: "accordion" as const,
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[30vw] min-w-[500px] self-center shadow-md rounded-lg p-10 my-auto mx-auto mt-10 bg-[#2a2a2a] text-white"
    >
      <PaymentElement options={paymentElementOptions} className="mb-6" />

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#00CC96] text-white font-semibold py-3 px-6 rounded-md hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center">
          {isLoading ? (
            <div className="spinner animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>

      {message && <div className="text-center text-gray-300 mt-4">{message}</div>}
    </form>
  )
}

