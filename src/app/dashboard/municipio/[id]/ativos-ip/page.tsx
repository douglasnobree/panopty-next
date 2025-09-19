"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar, Activity } from "lucide-react"
import api from "@/services/api"
import type { AllIpAssets } from "@/lib/types"

interface CityIpAssetsProps {
  params: Promise<{
    id: string
  }>
}

export default function CityIpAssets({ params }: CityIpAssetsProps) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const cityId = resolvedParams.id
  const [loading, setLoading] = useState(true)
  const [ipAssets, setIpAssets] = useState<AllIpAssets[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await api.post(`/getAtivosIp/${cityId}`)
        setIpAssets(response.data.data)
      } catch (error) {
        console.error("Erro ao buscar ativos de IP:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [cityId])

  const totalAssets = ipAssets?.length || 0
  const activeAssets = ipAssets?.filter((asset) => asset.status === "Ativo").length || 0
  const currentYear = new Date().getFullYear()
  const currentYearAssets = ipAssets?.filter((asset) => asset.year === currentYear.toString()).length || 0

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ativos de IP</h1>
            <p className="text-gray-600 mt-1">Gerencie os ativos de propriedade intelectual</p>
          </div>
          <Button
            onClick={() => router.push(`/dashboard/municipio/${cityId}/ativos-ip/upload`)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo ativo de IP
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">TOTAL DE ATIVOS</p>
                  <p className="text-3xl font-bold text-gray-900">{totalAssets}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ATIVOS ATIVOS</p>
                  <p className="text-3xl font-bold text-gray-900">{activeAssets}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ATIVOS {currentYear}</p>
                  <p className="text-3xl font-bold text-gray-900">{currentYearAssets}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Ativos de IP</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-600">Carregando ativos...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Arquivo</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Ano</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Mês</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipAssets?.map((ipAsset, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-gray-900">{ipAsset.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={ipAsset.status === "Ativo" ? "default" : "secondary"}
                            className={ipAsset.status === "Ativo" ? "bg-green-100 text-green-800" : ""}
                          >
                            {ipAsset.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{ipAsset.year}</td>
                        <td className="py-3 px-4 text-gray-600">{ipAsset.month}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                            Ver detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!ipAssets || ipAssets.length === 0) && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum ativo de IP encontrado</p>
                    <Button
                      onClick={() => router.push(`/dashboard/municipio/${cityId}/ativos-ip/upload`)}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Adicionar primeiro ativo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
