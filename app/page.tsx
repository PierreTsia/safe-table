import { getInspectionsByEvaluationCode } from '@/lib/supabase'

export default async function Home() {
  try {
    // Try to fetch 5 high-risk inspections (evaluationCode 4)
    const inspections = await getInspectionsByEvaluationCode(4)
    
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">SafeTable - Test Connection</h1>
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Connection Status: ✅ Connected</h2>
          <p className="text-sm text-gray-600">Found {inspections.length} high-risk inspections</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Latest High-Risk Inspections:</h3>
          {inspections.slice(0, 15).map((inspection) => (
            <div key={inspection.id} className="border p-4 rounded-lg">
              <p className="font-medium">{inspection.businessName}</p>
              <p className="text-sm text-gray-600">{inspection.city}</p>
              <p className="text-sm text-red-600">Inspection Date: {new Date(inspection.inspectionDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
    )
  } catch (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">SafeTable - Connection Error</h1>
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">Connection Status: ❌ Error</h2>
          <p>Failed to connect to Supabase or fetch data.</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </main>
    )
  }
}
