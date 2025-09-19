"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileSpreadsheet, X, Upload, CheckCircle, AlertCircle } from "lucide-react"
import api from "@/services/api"

interface RegisterIPProps {
  params: Promise<{
    id: string
  }>
}

export default function RegisterIP({ params }: RegisterIPProps) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const cityId = Number.parseInt(resolvedParams.id)

  const [uploadComplete, setUploadComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError("Por favor, selecione um arquivo Excel (.xlsx ou .xls)")
      return
    }

    // Validate file size (80MB)
    if (file.size > 80 * 1024 * 1024) {
      setError("O arquivo deve ter no máximo 80MB")
      return
    }

    setError(null)
    setLoading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("city_id", cityId.toString())

      const response = await api.post("/insertCipFiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(progress)
          }
        },
      })

      setUploadComplete(true)
    } catch (error) {
      console.error("Erro no upload:", error)
      setError("Erro ao fazer upload do arquivo. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterData = async () => {
    if (!cityId) return

    setLoading(true)
    try {
      await api.post("/createMuni", { city_id: cityId })
      setUploadComplete(false)
      router.push(`/dashboard/municipio/${cityId}/ativos-ip`)
    } catch (error) {
      console.error("Erro ao registrar dados:", error)
      setError("Erro ao finalizar cadastro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Upload de Ativos de IP</CardTitle>
              <p className="text-gray-600 mt-2">Insira abaixo o arquivo Excel dos ativos de propriedade intelectual.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/municipio/${cityId}/ativos-ip`)}>
              <X className="h-6 w-6" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadComplete && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Arquivo enviado com sucesso! Clique em "Finalizar cadastro" para processar os dados.
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={loading || uploadComplete}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`
                  block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                  ${
                    uploadComplete
                      ? "border-green-300 bg-green-50"
                      : loading
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                  }
                  ${loading || uploadComplete ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {uploadComplete ? (
                  <>
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <p className="text-lg text-green-700 font-medium">Arquivo enviado com sucesso!</p>
                    <p className="text-sm text-green-600 mt-1">Pronto para processar os dados</p>
                  </>
                ) : loading ? (
                  <>
                    <Upload className="mx-auto h-16 w-16 text-orange-500 mb-4" />
                    <p className="text-lg text-orange-700 font-medium">Enviando arquivo...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-orange-600 mt-2">{uploadProgress}% concluído</p>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg text-gray-700 font-medium">Clique ou arraste um arquivo Excel para aqui</p>
                    <p className="text-sm text-gray-500 mt-2">Formatos aceitos: .xlsx, .xls (máximo 80MB)</p>
                  </>
                )}
              </label>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleRegisterData}
              disabled={!uploadComplete || loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processando...
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar cadastro
                </>
              )}
            </Button>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Instruções:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• O arquivo deve estar no formato Excel (.xlsx ou .xls)</li>
                <li>• Tamanho máximo: 80MB</li>
                <li>• Certifique-se de que os dados estão organizados corretamente</li>
                <li>• Após o upload, clique em "Finalizar cadastro" para processar</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
