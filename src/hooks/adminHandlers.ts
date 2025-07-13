"use client"

import { activateBanners, deactivateBanners, deleteBanners } from "@/lib/actions/banner";
import { useState } from "react"
import { toast } from "sonner"

export function useAdminListHandlers<T extends { id: number; status: boolean }>(params: {
  items: T[]
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  itemNameSingular: string
  routeBase: string
}) {
  const { items, setItems, itemNameSingular, routeBase } = params

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map((item) => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, itemId])
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== itemId))
    }
  }

  const handleEdit = (itemId?: number) => {
    const targetId = itemId || (selectedIds.length === 1 ? selectedIds[0] : null)

    if (!targetId) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione um ${itemNameSingular} para editar.`,
      })
      return
    }

    toast.info("Redirecionando...", {
      description: `Abrindo página de edição do ${itemNameSingular}.`,
    })

    setTimeout(() => {
      window.location.href = `${routeBase}/${targetId}/edit`
    }, 1000)
  }

  const handleDelete = async (itemId?: number) => {
    const targetIds = itemId ? [itemId] : selectedIds

    if (targetIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para excluir.`,
      })
      return
    }

    try {
      await deleteBanners(selectedIds)

      if (confirm(`Tem certeza que deseja excluir ${targetIds.length} ${itemNameSingular}(s)?`)) {
      setItems(items.filter((item) => !targetIds.includes(item.id)))

      toast.success(`${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) excluídos`, {
        description: `${targetIds.length} ${itemNameSingular}(s) foram excluídos permanentemente.`,
      })
      setSelectedIds([])
    }
    } catch(error) {
      console.error(error)
      toast.error("Erro ao deletar banners.")
    }
  }

  const handleActivate = async () => {
    if (selectedIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para ativar.`,
      })
      return
    }

    try {
      await activateBanners(selectedIds)
      setItems(
        items.map((item) =>
          selectedIds.includes(item.id) ? { ...item, status: true } : item
        )
      )
      toast.success(`${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) ativados com sucesso!`, {
        description: `${selectedIds.length} ${itemNameSingular}(s) foram ativados.`,
      })
      setSelectedIds([])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao ativar banners.")
    }
  }

  const handleDeactivate = async () => {
    if (selectedIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para desativar.`,
      })
      return
    }

    try {
      await deactivateBanners(selectedIds)
      setItems(
        items.map((item) =>
          selectedIds.includes(item.id) ? { ...item, status: false } : item
        )
      )
      toast.warning(`${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) desativados`, {
        description: `${selectedIds.length} ${itemNameSingular}(s) foram desativados.`,
      })

      setSelectedIds([])
    } catch (error) {
      console.error(error)
      toast.error("Erro ao ativar banners.")
    }
  }

  return {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleEdit,
    handleDelete,
    handleActivate,
    handleDeactivate
  }
}
