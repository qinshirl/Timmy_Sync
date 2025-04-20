"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Input,
  Button,
  Form,
  theme,
  Card,
  Row,
  Col,
  message,
} from "antd"
import type { CalendarProps } from "antd"
import { Popconfirm } from "antd"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { Button as AntButton } from "antd"
import { ReloadOutlined, ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons"

export default function ImportantDatesPage() {
  const router = useRouter()
  const { token } = theme.useToken()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [dates, setDates] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)

  const wrapperStyle: React.CSSProperties = {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    padding: "1rem",
    backgroundColor: "white",
    marginBottom: "1.5rem",
  }

  const onSelectDate: CalendarProps<Dayjs>["onSelect"] = (date) => {
    setSelectedDate(date)
  }

  const fetchDates = async () => {
    const res = await fetch("/api/date")
    const data = await res.json()
    setDates(data)
  }

  const handleSubmit = async (values: any) => {
    if (!selectedDate) return alert("Please select a date.")

    const res = await fetch("/api/date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        date: selectedDate.toDate(),
      }),
    })

    const result = await res.json()
    if (res.ok) {
      message.success("Date added!")
      setShowForm(false)
      fetchDates()
    } else {
      message.error(result.error || "Something went wrong.")
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/date/${id}`, {
      method: "DELETE",
    })
    const result = await res.json()
    if (res.ok) {
      message.success("Date removed!")
      fetchDates()
    } else {
      message.error(result.error || "Failed to delete.")
    }
  }

  useEffect(() => {
    fetchDates()
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-right mb-2">
        <AntButton type="link" href="/" icon={<ArrowLeftOutlined />}>
          Back to Home
        </AntButton>
      </div>

      <div className="mb-4">
        <Button type="dashed" onClick={() => setShowForm(!showForm)} block>
          {showForm ? "Cancel" : "➕ Add Important Date"}
        </Button>
      </div>

      {showForm && (
        <>
          <div style={wrapperStyle}>
            <Calendar fullscreen={false} onSelect={onSelectDate} />
          </div>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
              <Input placeholder="e.g. Anniversary" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea placeholder="Optional description..." />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form>
        </>
      )}

      {dates.length > 0 && (
        <div className="mt-10">
            <div style={{ marginBottom: "1rem" }}></div>
          {/* <h2 className="text-lg font-semibold mb-4">Our Dates</h2> */}
          <Row gutter={[16, 16]}>
            {dates.map((item) => {
              const today = dayjs()
              const eventDate = dayjs(item.date)
              const diff = eventDate.diff(today, "day")
              const isPast = diff < 0
              const days = Math.abs(diff)

              return (
                <Col key={item.id} xs={24} sm={12} md={8}>
                  <Card
                    title={item.title}
                    extra={
                        <Popconfirm
                          title="Delete this date?"
                          description="Are you sure you want to delete this important date?"
                          onConfirm={() => handleDelete(item.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button size="small" danger>
                            <DeleteOutlined />
                          </Button>
                        </Popconfirm>
                      }
                    
                    style={{ textAlign: "center" }}
                    bordered
                  >
                    <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#1e3a8a" }}>{days}</div>
                    <p className="text-sm mt-2 text-gray-600">
                      {isPast
                        ? `days since ${eventDate.format("YYYY-MM-DD")}`
                        : `days until ${eventDate.format("YYYY-MM-DD")}`}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    )}
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>
      )}
    </div>
  )
}