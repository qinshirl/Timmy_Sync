// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "../../components/ui/button"

// export default function SignUpPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [name, setName] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     const res = await fetch("/api/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, password }),
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       setError(data.error || "Something went wrong")
//       setLoading(false)
//     } else {
//       router.push("/signin")
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-16">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           className="w-full border p-2 rounded"
//           type="text"
//           placeholder="Your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           className="w-full border p-2 rounded"
//           type="email"
//           placeholder="Email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           className="w-full border p-2 rounded"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         {error && <p className="text-red-500">{error}</p>}
//         <Button type="submit" disabled={loading} className="w-full">
//           {loading ? "Creating..." : "Sign Up"}
//         </Button>
//       </form>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Form, Input, Typography, Card } from "antd"

const { Title, Text, Link } = Typography

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    setLoading(true)
    setError("")

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Something went wrong")
      setLoading(false)
    } else {
      router.push("/signin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card style={{ width: 400 }}>
        <div className="flex justify-center mb-4">
          <img
          src="/timmysync.png"
          alt="TimmySync Logo"
          style={{ width: "50%" }}
            />
        </div>
        <Title level={3} className="text-center mb-4">Create Account</Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Your name" />
          </Form.Item>

          <Form.Item
            label="Email address"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Create a password" />
          </Form.Item>

          {error && <Text type="danger">{error}</Text>}

          <Form.Item className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ backgroundColor: "#2f54eb", borderColor: "#2f54eb" }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text>Already have an account? </Text>
          <Link href="/signin">Sign In</Link>
        </div>
      </Card>
    </div>
  )
}