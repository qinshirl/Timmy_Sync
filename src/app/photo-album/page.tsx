// src/app/photo-album/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Upload, message, Image, Row, Col, Input, Button, Typography, Space, Card } from "antd"
import type { UploadFile, UploadProps} from "antd"
import ImgCrop from "antd-img-crop"
import { supabase } from "@/lib/supabase"
import { escape } from "querystring"
import { Button as AntButton } from "antd"
import { ReloadOutlined, ArrowLeftOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Text } = Typography

interface Photo {
  id: string
  url: string
  title?: string
}

interface Comment {
  id: string
  text: string
  userId: string
  photoId: string
  createdAt: string
}

export default function PhotoAlbumPage() {
  const { data: session } = useSession()
  const [uploading, setUploading] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({})

  // === Fetch all photos
  const fetchPhotos = async () => {
    const res = await fetch("/api/photo/list")
    const data = await res.json()
    setPhotos(data)
  }

  // === Fetch comments for a specific photo
  const fetchComments = async (photoId: string) => {
    const res = await fetch(`/api/photo/${photoId}/comment`)
    const data = await res.json()
    setCommentsMap((prev) => ({ ...prev, [photoId]: data }))
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  useEffect(() => {
    photos.forEach((photo) => fetchComments(photo.id))
  }, [photos])

  // realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("comments-channel", {
        config: {
          broadcast: { self: false }, 
        },
      })
      .on("broadcast", { event: "new-comment" }, 
        (payload) => {
        const newComment = payload.payload as Comment
        setCommentsMap((prev) => {
          const photoComments = prev[newComment.photoId] || []
          // check duplicate
          const alreadyExists = photoComments.some((c) => c.id === newComment.id)
          if (alreadyExists) return prev
          return {
            ...prev,
            [newComment.photoId]: [...photoComments, newComment],
          }
        })
      })
      .subscribe()
  
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // photo upload
  const handleUpload = async ({ file }: { file: File }) => {
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/photo/upload", {
      method: "POST",
      body: formData,
    })

    const result = await res.json()
    if (res.ok) {
      message.success("Uploaded!")
      fetchPhotos()
      setFileList([])
    } else {
      message.error(result.error || "Upload failed")
    }
    setUploading(false)
  }

  // delete photo
  const handleRemove = async (file: UploadFile) => {
    const res = await fetch(`/api/photo/delete/${file.uid}`, {
      method: "DELETE",
    })

    if (res.ok) {
      message.success("Deleted!")
      fetchPhotos()
    } else {
      message.error("Delete failed")
    }
  }

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handlePreview: UploadProps["onPreview"] = async (file) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as File)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new window.Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const handleCommentSubmit = async (photoId: string) => {
    const text = commentInputs[photoId]?.trim()
    if (!text) return

    const res = await fetch(`/api/photo/${photoId}/comment`, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      const newComment = await res.json()
      setCommentInputs((prev) => ({ ...prev, [photoId]: "" }))
    
      // Local update
      setCommentsMap((prev) => {
        const photoComments = prev[photoId] || []
        return {
          ...prev,
          [photoId]: [...photoComments, newComment],
        }
      })
    
      // Realtime broadcast
      supabase.channel("comments-channel").send({
        type: "broadcast",
        event: "new-comment",
        payload: newComment,
      })
    } else {
      const error = await res.json()
      message.error(error.error || "Failed to add comment")
    } 
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      {/* Back Button */}
      <div className="text-right mb-2">
        <AntButton type="link" href="/" icon={<ArrowLeftOutlined />}>
          Back to Home
        </AntButton>
      </div>
      <Upload.Dragger
        name="file"
        multiple={false}
        customRequest={({ file }) => handleUpload({ file: file as File })}
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onDrop={(e) => console.log('Dropped files', e.dataTransfer.files)}
        showUploadList={true}
        accept="image/*"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag photo to this area to upload</p>
        <p className="ant-upload-hint">
          Only one photo at a time. No inappropriate content, please 💖
        </p>
      </Upload.Dragger>

      {photos.length === 0 ? (
        <p className="text-center text-gray-500">No photos uploaded yet.</p>
      ) : (
        <Row gutter={[16, 16]}>
          {photos.map((photo) => (
            <Col span={8} key={photo.id}>
              <div style={{ marginBottom: "20px" }} />
              <Card
                style={{ width: 300 }}
                cover={
                  <Image
                    src={photo.url}
                    alt={photo.title || "Photo"}
                    width={300}
                    height={300}
                    style={{ objectFit: "cover" }}
                    preview={{
                      mask: <span style={{ color: "#fff" }}>Click to Preview</span>,
                    }}
                  />
                }
              >
                <Text strong>Comments:</Text>
                <div className="space-y-1 mb-2 max-h-24 overflow-y-auto text-sm">
                  {(commentsMap[photo.id] || []).map((c) => (
                    <p key={c.id}> {c.text}</p>
                  ))}
                </div>

                <Space.Compact style={{ width: "100%" }}>
                  <TextArea
                    rows={1}
                    placeholder="Add a comment"
                    value={commentInputs[photo.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [photo.id]: e.target.value,
                      }))
                    }
                  />
                  <Button type="primary" onClick={() => handleCommentSubmit(photo.id)}>
                    Send
                  </Button>
                </Space.Compact>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}