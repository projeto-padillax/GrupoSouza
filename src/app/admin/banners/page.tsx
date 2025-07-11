import { AdminFooter } from "@/components/admin/footer";
import { AdminHeader } from "@/components/admin/header";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form, useForm } from "react-hook-form";

export default function AdminPage() {
    const form = useForm()
  return (
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <main className="py-8">
            <Form> 
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </Form>
        </main>
        <AdminFooter />
      </div>
  )
}