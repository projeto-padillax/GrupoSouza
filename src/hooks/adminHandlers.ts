"use client"

import { useState } from "react"
import { toast } from "sonner"

export function useAdminListHandlers<T extends { id: number; status: string }>(params: {
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

  const handleDelete = (itemId?: number) => {
    const targetIds = itemId ? [itemId] : selectedIds

    if (targetIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para excluir.`,
      })
      return
    }

    if (confirm(`Tem certeza que deseja excluir ${targetIds.length} ${itemNameSingular}(s)?`)) {
      setItems(items.filter((item) => !targetIds.includes(item.id)))

      toast.success(`${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) excluídos`, {
        description: `${targetIds.length} ${itemNameSingular}(s) foram excluídos permanentemente.`,
      })

      setSelectedIds([])
    }
  }

  const handleActivate = () => {
    if (selectedIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para ativar.`,
      })
      return
    }

    setItems(
      items.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "Ativo" as string } : item
      )
    )

    toast.success(`${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) ativados com sucesso!`, {
      description: `${selectedIds.length} ${itemNameSingular}(s) foram ativados.`,
    })

    setSelectedIds([])
  }

  const handleDeactivate = () => {
    if (selectedIds.length === 0) {
      toast.warning(`Nenhum ${itemNameSingular} selecionado`, {
        description: `Selecione pelo menos um ${itemNameSingular} para desativar.`,
      })
      return
    }

    setItems(
      items.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "Inativo" as string } : item
      )
    )

    toast.warning(`${itemNameSingular.charAt(0).toUpperCase() + itemNameSingular.slice(1)}(s) desativados`, {
      description: `${selectedIds.length} ${itemNameSingular}(s) foram desativados.`,
    })

    setSelectedIds([])
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
