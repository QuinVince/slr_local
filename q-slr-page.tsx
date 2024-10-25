import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

export default function Component() {
  const [responses, setResponses] = useState({
    question1: '',
    question2: '',
    question3: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResponses(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 font-lato">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">Q-SLR</h1>
          </div>
          <button className="text-gray-500 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button className="flex items-center text-sky-600 hover:text-sky-700">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="w-1/4 h-1 bg-sky-500 rounded"></div>
            <div className="w-1/4 h-1 bg-sky-200 rounded"></div>
            <div className="w-1/4 h-1 bg-gray-200 rounded"></div>
            <div className="w-1/4 h-1 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Nouvelle query</span>
            <span>Questions</span>
            <span>Pubmed query</span>
            <span>Sauvegarde</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Répondez aux questions suivantes</h2>
        <p className="text-gray-600 mb-8">Cette étape permettra de générer une requête Pubmed pertinente</p>
        <div className="space-y-6">
          <div>
            <label htmlFor="question1" className="block text-sm font-medium text-gray-700 mb-2">
              Which specific diseases or subtypes of multiple sclerosis does the review focus on in relation to ocrelizumab combination therapy?
            </label>
            <textarea
              id="question1"
              name="question1"
              rows={3}
              className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={responses.question1}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="question2" className="block text-sm font-medium text-gray-700 mb-2">
              Are we interested in any particular combination therapies or specific drugs used in conjunction with ocrelizumab?
            </label>
            <textarea
              id="question2"
              name="question2"
              rows={3}
              className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={responses.question2}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="question3" className="block text-sm font-medium text-gray-700 mb-2">
              What types of study designs (e.g., randomized controlled trials, observational studies, meta-analyses) should be included in the literature review?
            </label>
            <textarea
              id="question3"
              name="question3"
              rows={3}
              className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={responses.question3}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
      </main>
    </div>
  )
}