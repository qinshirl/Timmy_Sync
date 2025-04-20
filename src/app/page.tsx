// // src/app/page.tsx
// "use client"

// import { useSession } from "next-auth/react"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, Typography, Flex, Button, Input, message as antdMessage } from "antd"
// import { LinkOutlined, PictureOutlined, EnvironmentOutlined } from "@ant-design/icons"

// const { Title, Paragraph } = Typography

// export default function HomePage() {
//   const { data: session, status } = useSession()
//   const [yourId, setYourId] = useState("")
//   const [partnerId, setPartnerId] = useState("")
//   const [linkInput, setLinkInput] = useState("")
//   const [message, setMessage] = useState("")
//   const router = useRouter()

//   useEffect(() => {
//     if (session?.user) {
//       fetch("/api/user/partner")
//         .then((res) => res.json())
//         .then((data) => {
//           setYourId(data.id)
//           setPartnerId(data.partnerId || "")
//         })
//     }
//   }, [session])

//   const handleLink = async () => {
//     const res = await fetch("/api/user/link", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ partnerCode: linkInput }),
//     })

//     const data = await res.json()
//     setMessage(data.message || data.error)

//     if (res.ok) {
//       setPartnerId(linkInput)
//       setLinkInput("")
//     } else {
//       antdMessage.error(data.error)
//     }
//   }

//   if (status === "loading") {
//     return <p className="text-center mt-10">Loading...</p>
//   }

//   if (!session) {
//     return <p className="text-center mt-10">You must be signed in to view this page.</p>
//   }

//   return (
//     <div className="max-w-5xl mx-auto mt-12 px-4 space-y-8">
//       <Title level={2} className="text-center">Welcome, {session.user?.name || "Guest"}</Title>

//       {partnerId ? (
//         <>
//           <Flex justify="space-around" wrap gap={16}>
//             <Card
//               hoverable
//               style={{ width: 300 }}
//               cover={<img alt="dates" src="/images/dates.jpg" style={{ height: 150, objectFit: "cover" }} />}
//               onClick={() => router.push("/important-dates")}
//             >
//               <Title level={4}>Important Dates</Title>
//               <Paragraph>Track anniversaries, birthdays, and milestones here.</Paragraph>
//             </Card>

//             <Card
//               hoverable
//               style={{ width: 300 }}
//               cover={<img alt="photos" src="/images/photos.jpg" style={{ height: 150, objectFit: "cover" }} />}
//               onClick={() => router.push("/photo-album")}
//             >
//               <Title level={4}>Shared Photo Album</Title>
//               <Paragraph>Upload and comment on photos with your partner.</Paragraph>
//             </Card>

//             <Card
//               hoverable
//               style={{ width: 300 }}
//               cover={<img alt="location" src="/images/location.jpg" style={{ height: 150, objectFit: "cover" }} />}
//               onClick={() => router.push("/location")}
//             >
//               <Title level={4}>Real-Time Location</Title>
//               <Paragraph>See where your partner is, live!</Paragraph>
//             </Card>
//           </Flex>
//         </>
//       ) : (
//         <>
//           <Paragraph className="text-center">You are not linked with a partner yet.</Paragraph>

//           <Card title="Link with Your Partner" bordered={true} style={{ maxWidth: 500, margin: "0 auto" }}>
//             <Paragraph>Your Partner Code:</Paragraph>
//             <pre className="bg-gray-100 p-2 rounded border text-sm mb-3">{yourId || "Loading..."}</pre>

//             <Input
//               placeholder="Enter your partner's code"
//               value={linkInput}
//               onChange={(e) => setLinkInput(e.target.value)}
//               className="mb-2"
//             />
//             <Button
//               type="primary"
//               onClick={handleLink}
//               disabled={!linkInput.trim()}
//               block
//             >
//               Link Partner
//             </Button>

//             {message && (
//               <Paragraph className="text-blue-600 mt-2 text-center">{message}</Paragraph>
//             )}
//           </Card>
//         </>
//       )}
//     </div>
//   )
// }


"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Layout, Card, Typography, Button, Flex, Input, message, Avatar, Tooltip, Collapse } from "antd"
import {
  CalendarOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  CopyOutlined
} from "@ant-design/icons"

const { Panel } = Collapse

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

export default function HomePage() {
  const { data: session, status } = useSession()
  const [yourId, setYourId] = useState("")
  const [partnerId, setPartnerId] = useState("")
  const [linkInput, setLinkInput] = useState("")
  const [feedback, setFeedback] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/partner")
        .then((res) => res.json())
        .then((data) => {
          setYourId(data.id)
          setPartnerId(data.partnerId || "")
        })
    }
  }, [session])

  const handleLink = async () => {
    const res = await fetch("/api/user/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerCode: linkInput }),
    })

    const data = await res.json()
    setFeedback(data.message || data.error)

    if (res.ok) {
      setPartnerId(linkInput)
      setLinkInput("")
    }
  }

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>
  if (!session) return <p className="text-center mt-10">You must be signed in to view this page.</p>

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="flex justify-between items-center px-6"
        style={{
          backgroundColor: "#1677ff", // Updated theme blue
          height: "56px",
          boxShadow: "0 2px 8px #1677ff",
        }}
      >
        <div className="flex items-center gap-2">
          <img src="/timmylogo.png" alt="Logo" style={{ height: 45 }} />
          <Title level={5} style={{ marginBottom: 0, color: "#ffffff" }}>TimmySync</Title>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {/* <Text style={{ color: "#ffffff" }}>{session.user?.name}</Text> */}
          <Button
            type="primary"
            style={{
              backgroundColor: "#2f54eb",
              borderColor: "#2f54eb",
              color: "#ffffff",
            }}
            onClick={() => signOut({ callbackUrl: "/signin" })}
          >
            Sign Out
          </Button>
        </div>
      </Header>


      {/* Content */}
      <Content className="max-w-5xl mx-auto px-4 py-12">
        <div style={{ marginBottom: "24px" }}></div>
        {/* <Title level={2} className="text-center mb-10">Welcome, {session.user?.name || "Guest"}</Title> */}
        <Typography className="text-center mb-8">
          <Title level={2} style={{ color: "#2f54eb", marginBottom: 8 }}>
            Welcome, {session.user?.name || "Guest"} 💙
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            You’re now connected to <strong>TimmySync</strong> - a space made for couples.
          </Text>
        </Typography>

        <Collapse bordered={false} className="max-w-xl mx-auto mb-8">
          <Panel header="Why did we build this app?" key="1">
          <Paragraph>
            <strong>TimmySync</strong> was created as a heartfelt tool to help couples stay meaningfully connected, even through busy schedules or physical distance. It’s more than just an app — it’s a space where partners can cherish memories, celebrate milestones, and stay emotionally in sync with one another.
          </Paragraph>
          <Paragraph>
            From tracking special dates and sharing photo moments to seeing each other’s location in real time, every feature is designed with care to nurture closeness and communication. This project was inspired by a desire to strengthen and simplify connection in relationships — something we believe everyone deserves. 💙
          </Paragraph>
          <Paragraph>
            We hope TimmySync brings you a sense of comfort, joy, and togetherness as you journey through life with your special someone. 🌟
          </Paragraph>
          </Panel>
        </Collapse>

        {partnerId ? (
          <Flex wrap="wrap" justify="center" gap="large">
            <Card
              hoverable
              cover={<img src="/images/dates.jpg" alt="Important Dates" style={{ height: 200, objectFit: "cover" }} />}
              style={{ width: 300 }}
              onClick={() => router.push("/important-dates")}
            >
              <Title level={4}><CalendarOutlined /> Important Dates</Title>
              <Paragraph>Track anniversaries, birthdays, and milestones here.</Paragraph>
            </Card>

            <Card
              hoverable
              cover={<img src="/images/photos.jpg" alt="Photo Album" style={{ height: 200, objectFit: "cover" }} />}
              style={{ width: 300 }}
              onClick={() => router.push("/photo-album")}
            >
              <Title level={4}><PictureOutlined /> Shared Photo Album</Title>
              <Paragraph>Upload and comment on photos with your partner.</Paragraph>
            </Card>

            <Card
              hoverable
              cover={<img src="/images/location.jpg" alt="Real-Time Location" style={{ height: 200, objectFit: "cover" }} />}
              style={{ width: 300 }}
              onClick={() => router.push("/location")}
            >
              <Title level={4}><EnvironmentOutlined /> Real-Time Location</Title>
              <Paragraph>See where your partner is, live!</Paragraph>
            </Card>
          </Flex>
        ) : (
          <div className="space-y-6 text-center max-w-md mx-auto">
            <Text>You are not linked with a partner yet.</Text>
            <Card bordered className="text-left">
              {/* <p className="text-sm">Your Partner Code:</p>
              <pre className="bg-gray-100 p-2 rounded border text-sm">{yourId || "Loading..."}</pre> */}
                <p className="text-sm mb-1">Your Partner Code:</p>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded border text-sm">
                  <span className="font-mono break-all">{yourId || "Loading..."}</span>
                  <Tooltip title="Copy to clipboard">
                    <CopyOutlined
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      navigator.clipboard.writeText(yourId)
                      message.success("Partner code copied!")
                    }}
                    style={{ marginLeft: "auto" }}
                    />
                  </Tooltip>
                </div>
                <div style={{ marginBottom: "16px" }}></div>
              <Input
                className="mt-2"
                placeholder="Enter your partner's code"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
              />
              <div style={{ marginBottom: "16px" }}></div>
              <Button
                type="primary"
                className="mt-2 w-full"
                onClick={handleLink}
                disabled={!linkInput.trim()}
              >
                Link Partner
              </Button>
              {feedback && <Text type="success">{feedback}</Text>}
            </Card>
          </div>
        )}
      </Content>

      {/* Footer */}
      <Footer className="text-center text-sm text-gray-500">
        TimmySync @2025 Created by Shirley & Yuyang
      </Footer>
    </Layout>
  )
}
