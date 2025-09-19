"use client"

import { type ChangeEvent, type DragEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import api from "@/services/api"

export default function RegisterLaw() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cityId = searchParams.get("registre") || ""
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0]
    if (file && file.type === "application/json") {
      setSelectedFile(file)
      setUploadStatus("idle")
    } else {
      setSelectedFile(null)
      setUploadStatus("error")
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files && event.dataTransfer.files[0]
    if (file && file.type === "application/json") {
      setSelectedFile(file)
      setUploadStatus("idle")
    } else {
      setSelectedFile(null)
      setUploadStatus("error")
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  const onSubmit = async () => {
    if (selectedFile != null) {
      if (cityId) {
        setIsUploading(true)
        try {
          await api.post(
            "/uploadJson",
            {
              arquivo: selectedFile,
              city_id: cityId,
            },
            { headers: { "Content-Type": "multipart/form-data" } },
          )
          setUploadStatus("success")
          setTimeout(() => {
            router.back()
          }, 2000)
        } catch (error) {
          console.log(error)
          setUploadStatus("error")
        } finally {
          setIsUploading(false)
        }
      } else {
        setUploadStatus("error")
      }
    } else {
      setUploadStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Novo Projeto de Lei</h1>
              <p className="text-gray-600 mt-1">Faça upload do arquivo JSON do projeto de lei</p>
            </div>
            <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Upload Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2 text-orange-primary" />
                Upload de Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-orange-primary hover:bg-orange-light/20"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                    <div>
                      <h3 className="text-lg font-medium text-green-700">Arquivo Selecionado</h3>
                      <div className="flex items-center justify-center mt-2">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        <span className="text-green-600 font-medium">{selectedFile.name}</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">Tamanho: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 mx-auto text-gray-400" />
                    <div>
                      <Button asChild className="bg-orange-primary hover:bg-orange-primary/90 text-white">
                        <label className="cursor-pointer">
                          Selecionar arquivo JSON
                          <input
                            type="file"
                            accept="application/json"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </label>
                      </Button>
                      <p className="mt-2 text-gray-600">Ou arraste um arquivo JSON para aqui</p>
                      <p className="text-sm text-gray-500 mt-1">Apenas arquivos JSON são aceitos</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Alerts */}
          {uploadStatus === "success" && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Projeto de lei cadastrado com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Erro ao processar o arquivo. Verifique se é um arquivo JSON válido.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => router.back()} disabled={isUploading}>
              Cancelar
            </Button>
            <Button
              disabled={!selectedFile || isUploading}
              onClick={onSubmit}
              className="bg-orange-primary hover:bg-orange-primary/90 text-white min-w-[120px]"
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
