"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { data: session, status } = useSession()
  const [yourId, setYourId] = useState("")
  const [partnerId, setPartnerId] = useState("")
  const [linkInput, setLinkInput] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/partner")
        .then(res => res.json())
        .then(data => {
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
    setMessage(data.message || data.error)

    if (res.ok) {
      setPartnerId(linkInput)
      setLinkInput("")
    }
  }

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>
  }

  if (!session) {
    return <p className="text-center mt-10">You must be signed in to view this page.</p>
  }

  return (
    <div className="max-w-xl mx-auto mt-16 space-y-6">
      <h1 className="text-3xl font-bold text-center">Welcome, {session.user?.name || "Guest"}</h1>

      {partnerId ? (
        <>
          <p className="text-center text-green-600">You are linked with a partner!</p>

          {/* feature sections */}
          <div className="mt-10 space-y-6">
          <section
            className="bg-white shadow rounded p-4 hover:bg-gray-50 transition cursor-pointer"
            onClick={() => window.location.href = "/important-dates"}
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-600 underline">Important Dates</h2>
            <p className="text-gray-600">Track anniversaries, birthdays, and milestones here.</p>
          </section>


            <section className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold mb-2">Shared Photo Album</h2>
              <p className="text-gray-600">Upload and comment on photos with your partner.</p>
              {/*  */}
            </section>

            <section className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold mb-2">Real-Time Location</h2>
              <p className="text-gray-600">See where your partner is, live!</p>
              {/*  */}
            </section>
          </div>
        </>
      ) : (
        <>
          <p className="text-center">You are not linked with a partner yet.</p>
          <div className="bg-gray-100 p-4 rounded">
            <p className="mb-2 text-sm">Your Partner Code:</p>
            <pre className="bg-white p-2 rounded border text-sm">{yourId || "Loading..."}</pre>
          </div>
          <div className="space-y-2">
            <input
              className="w-full border p-2 rounded"
              type="text"
              placeholder="Enter your partner's code"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
            />
            <Button
              onClick={handleLink}
              className="w-full"
              disabled={!linkInput.trim()}
            >
              Link Partner
            </Button>
            {message && <p className="text-sm text-center text-blue-600">{message}</p>}
          </div>
        </>
      )}
    </div>
  )
}