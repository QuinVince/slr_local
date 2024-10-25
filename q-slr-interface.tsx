import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Copy, File, PieChart, ArrowRight } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-white font-['Lato']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
      `}</style>
      <header className="h-20 border-b border-[#e1e1e1]">
        <div className="container mx-auto flex items-center h-full px-6">
          <button className="mr-8">
            <div className="w-5 h-0.5 bg-[#beced9] rounded mb-1"></div>
            <div className="w-5 h-0.5 bg-[#beced9] rounded mb-1"></div>
            <div className="w-5 h-0.5 bg-[#beced9] rounded"></div>
          </button>
          <div className="w-8 h-8 mr-4 relative">
            <div className="w-8 h-8 absolute origin-top-left rotate-45 bg-[#62b6cb] rounded-tl-xl rounded-tr-lg rounded-bl-lg rounded-br-xl"></div>
          </div>
          <h1 className="text-black text-lg font-bold">Q-SLR</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 pt-16">
        <h2 className="text-center text-black text-2xl font-bold mb-10">
          Que souhaitez-vous faire ?
        </h2>
        <div className="relative mb-12">
          <Input
            className="w-full h-14 rounded-2xl border-2 border-[#62b6cb] shadow text-lg pl-5 pr-16"
            placeholder="Décrivez votre recherche en langage naturel"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#e7e7e7] rounded-full flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-90" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button className="h-20 bg-[#62b6cb] rounded-2xl text-white text-base font-bold hover:bg-[#5aa5b9]">
            <FileText className="w-6 h-6 mr-4" />
            Nouvelle query
          </Button>
          <Button variant="outline" className="h-20 rounded-2xl text-black text-base font-bold">
            <Copy className="w-6 h-6 mr-4" />
            Duplicate analysis
          </Button>
          <Button variant="outline" className="h-20 rounded-2xl text-black text-base font-bold">
            <File className="w-6 h-6 mr-4" />
            File screening
          </Button>
          <Button variant="outline" className="h-20 rounded-2xl text-black text-base font-bold">
            <PieChart className="w-6 h-6 mr-4" />
            PRISM diagram
          </Button>
        </div>
      </main>
    </div>
  )
}