"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: "Appetizer" | "Main" | "Dessert"
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEdit, setCurrentEdit] = useState<MenuItem | null>(null)
  
  // Form State
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Main")
  const [saving, setSaving] = useState(false)

  // Fetch Menu
  useEffect(() => {
    const q = query(collection(db, "menu"), orderBy("category", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem))
      setMenuItems(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setCurrentEdit(item)
      setName(item.name)
      setDescription(item.description)
      setPrice(item.price)
      setCategory(item.category)
    } else {
      setCurrentEdit(null)
      setName("")
      setDescription("")
      setPrice("")
      setCategory("Main")
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name || !price || !description) return
    setSaving(true)

    try {
      if (currentEdit) {
        // Update
        await updateDoc(doc(db, "menu", currentEdit.id), {
          name, description, price, category
        })
      } else {
        // Create
        await addDoc(collection(db, "menu"), {
          name, description, price, category, createdAt: new Date().toISOString()
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving menu item:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "menu", id))
    }
  }

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Menu Management</h1>
          <p className="text-sm text-muted-foreground">Update your seasonal offerings.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : menuItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No menu items found.</TableCell>
              </TableRow>
            ) : (
              menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-serif">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      item.category === "Appetizer" ? "border-orange-200 bg-orange-50 text-orange-700" :
                      item.category === "Main" ? "border-blue-200 bg-blue-50 text-blue-700" :
                      "border-pink-200 bg-pink-50 text-pink-700"
                    }>
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground text-sm">{item.description}</TableCell>
                  <TableCell>₦{item.price}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEdit ? "Edit Menu Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {currentEdit ? "Update the details below." : "Add a new dish to your menu."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Truffle Risotto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₦)</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Appetizer">Appetizer</SelectItem>
                    <SelectItem value="Main">Main Course</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ingredients and details..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
