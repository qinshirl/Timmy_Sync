// src/app/location/page.tsx


"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { message, Card, Row, Col } from "antd"
import { Button as AntButton } from "antd"
import { Button } from "@/components/ui/button"
import { ReloadOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import Map from "@/components/Map"

interface LocationData {
  latitude: number
  longitude: number
  updatedAt: string
}

export default function LocationPage() {
  const { data: session } = useSession()
  const [yourLocation, setYourLocation] = useState<LocationData | null>(null)
  const [partnerLocation, setPartnerLocation] = useState<LocationData | null>(null)

  const fetchPartnerLocation = async () => {
    const res = await fetch("/api/location/get")
    const data = await res.json()

    if (res.ok) {
      console.log("📡 Partner location (polling):", data.partnerLocation)
      setPartnerLocation(data.partnerLocation)
    } else {
      message.error(data.error)
    }
  }

  const updateLocation = async (lat: number, lng: number) => {
    await fetch("/api/location/update", {
      method: "POST",
      body: JSON.stringify({ latitude: lat, longitude: lng }),
      headers: { "Content-Type": "application/json" },
    })
  }

  // Watch and update own location
  useEffect(() => {
    if (!session?.user) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const updatedAt = new Date().toISOString()

        setYourLocation({ latitude, longitude, updatedAt })
        updateLocation(latitude, longitude)
      },
      (error) => {
        message.error("Failed to access location")
        console.error(error)
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [session])

  // Fetch partner location initially and periodically
  useEffect(() => {
    fetchPartnerLocation()
    const interval = setInterval(fetchPartnerLocation, 15000)
    return () => clearInterval(interval)
  }, [])

  // Listen to Supabase broadcast for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("location-updates", {
        config: { broadcast: { self: false } },
      })
      .on("broadcast", { event: "partner-location" }, (payload) => {
        const loc = payload.payload as LocationData
        console.log("⚡ Partner location (realtime):", loc)
        setPartnerLocation(loc)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      {/* Back Button */}
      <div className="text-right mb-2">
        <AntButton type="link" href="/" icon={<ArrowLeftOutlined />}>
          Back to Home
        </AntButton>
      </div>

      {/* <h1 className="text-2xl font-bold text-center"> Real-Time Location</h1> */}
      {/* Map */}
      <Map yourLocation={yourLocation} partnerLocation={partnerLocation} />

      {/* Location Info Cards */}
      <Row gutter={16} justify="center">
        <Col span={12}>
          <Card title="Your Location" bordered={false}>
            {yourLocation ? (
              <>
                <p>Lat: {yourLocation.latitude}</p>
                <p>Lng: {yourLocation.longitude}</p>
                <p>Last updated: {new Date(yourLocation.updatedAt).toLocaleTimeString()}</p>
              </>
            ) : (
              <p>Fetching...</p>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Partner's Location" bordered={false}>
            {partnerLocation ? (
              <>
                <p>Lat: {partnerLocation.latitude}</p>
                <p>Lng: {partnerLocation.longitude}</p>
                <p>Last updated: {new Date(partnerLocation.updatedAt).toLocaleTimeString()}</p>
              </>
            ) : (
              <p>Fetching...</p>
            )}
            <AntButton
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchPartnerLocation}
                >
                Refresh Partner Location
            </AntButton>
          </Card>
        </Col>
      </Row>
    {/* Refresh Button */}
    {/* <div className="text-center mt-4">
        <AntButton
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchPartnerLocation}
        >
          Refresh Partner Location
        </AntButton>
      </div> */}

      


    </div>
  )
}