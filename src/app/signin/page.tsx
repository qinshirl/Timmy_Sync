// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { signIn } from "next-auth/react"
// import { Button } from "@/components/ui/button"

// export default function SignInPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     })

//     if (res?.error) {
//       setError("Invalid credentials")
//     } else {
//       router.push("/") // redirect after login
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-16">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
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
//         <Button type="submit" className="w-full">
//           Sign In
//         </Button>
//       </form>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button, Form, Input, Typography, Card } from "antd"

const { Title, Text, Link } = Typography

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError("")

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/")
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
        <Title level={3} className="text-center mb-4">Sign In</Title>

        <Form layout="vertical" onFinish={handleSubmit}>
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
        <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {error && <Text type="danger">{error}</Text>}

          <Form.Item className="mt-4">
        <Button type="primary" htmlType="submit" block>
          Sign In
        </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text>Don't have an account? </Text>
          <Link href="/signup">Sign Up</Link>
        </div>
      </Card>
    </div>
  )
}