"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { X, CreditCard, Smartphone, Building, Loader2, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency, formatDate } from "../utils/validators"

const PaymentModal = ({ invoice, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("method") // 'method', 'processing', 'success', 'error'
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Pay with your credit or debit card",
      icon: CreditCard,
    },
    {
      id: "upi",
      name: "UPI Payment",
      description: "Pay using UPI apps like GPay, PhonePe",
      icon: Smartphone,
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct bank account transfer",
      icon: Building,
    },
  ]

  const handlePayment = async () => {
    setLoading(true)
    setError("")
    setStep("processing")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate random success/failure (80% success rate)
      const isSuccess = Math.random() > 0.2

      if (isSuccess) {
        setStep("success")
        setTimeout(() => {
          onSuccess(invoice, {
            method: paymentMethods.find((m) => m.id === paymentMethod)?.name || "Mock Payment",
            transactionId: `TXN-${Date.now()}`,
            processedAt: new Date().toISOString(),
          })
        }, 2000)
      } else {
        setStep("error")
        setError("Payment failed. Please try again or use a different payment method.")
      }
    } catch (error) {
      setStep("error")
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep("method")
    setPaymentMethod("card")
    setLoading(false)
    setError("")
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={step === "method" ? handleClose : undefined}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {step === "method" && "Payment Method"}
                    {step === "processing" && "Processing Payment"}
                    {step === "success" && "Payment Successful"}
                    {step === "error" && "Payment Failed"}
                  </CardTitle>
                  <CardDescription>
                    {step === "method" && "Choose how you'd like to pay"}
                    {step === "processing" && "Please wait while we process your payment"}
                    {step === "success" && "Your payment has been processed successfully"}
                    {step === "error" && "There was an issue processing your payment"}
                  </CardDescription>
                </div>
                {step === "method" && (
                  <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Invoice Summary */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Invoice</span>
                  <Badge variant="outline">{invoice.id}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Description</span>
                  <span className="text-sm font-medium text-gray-900">{invoice.description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-sm text-gray-900">{formatDate(invoice.date)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(invoice.amount)}</span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Payment Method Selection */}
              {step === "method" && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">Select Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <motion.div
                          key={method.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </RadioGroup>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                    <Button onClick={handlePayment} className="flex-1">
                      Pay {formatCurrency(invoice.amount)}
                    </Button>
                  </div>
                </div>
              )}

              {/* Processing State */}
              {step === "processing" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
                  <p className="text-gray-600">Please don't close this window...</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Amount: {formatCurrency(invoice.amount)}</p>
                    <p>Method: {paymentMethods.find((m) => m.id === paymentMethod)?.name}</p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {step === "success" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-4">Your payment has been processed and a receipt will be generated.</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Amount: {formatCurrency(invoice.amount)}</p>
                    <p>Method: {paymentMethods.find((m) => m.id === paymentMethod)?.name}</p>
                    <p>Transaction ID: TXN-{Date.now()}</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {step === "error" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again.</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                    <Button onClick={() => setStep("method")} className="flex-1">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default PaymentModal
