// Mock API service for admission analytics

// Types
interface AdmissionAnalyticsParams {
    from: string
    to: string
  }
  
  interface ProgramData {
    program: string
    count: number
  }
  
  interface TrendData {
    date: string
    count: number
  }
  
  interface AdmissionAnalytics {
    totalApplicants: number
    totalApplicantsTrend: number
    verifiedApplicants: number
    verifiedApplicantsTrend: number
    rejectedApplicants: number
    rejectedApplicantsTrend: number
    applicationsByProgram: ProgramData[]
    applicationTrends: TrendData[]
  }
  
  // Mock data generator
  function generateMockData(from: string, to: string): AdmissionAnalytics {
    // Generate random numbers for metrics
    const totalApplicants = Math.floor(Math.random() * 1500) + 500
    const verifiedApplicants = Math.floor(totalApplicants * (Math.random() * 0.5 + 0.3))
    const rejectedApplicants = Math.floor(totalApplicants * (Math.random() * 0.3))
  
    // Generate random trends (-10% to +20%)
    const totalApplicantsTrend = Math.floor(Math.random() * 30) - 10
    const verifiedApplicantsTrend = Math.floor(Math.random() * 30) - 10
    const rejectedApplicantsTrend = Math.floor(Math.random() * 30) - 10
  
    // Programs data
    const programs = [
      "Computer Science",
      "Business Administration",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Psychology",
      "Medicine",
      "Law",
      "Architecture",
    ]
  
    const applicationsByProgram = programs.map((program) => ({
      program,
      count: Math.floor(Math.random() * 1200) + 100,
    }))
  
    // Generate trend data for the date range
    const fromDate = new Date(from)
    const toDate = new Date(to)
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24))
  
    const applicationTrends: TrendData[] = []
  
    // Generate data for each day in the range
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(fromDate)
      currentDate.setDate(fromDate.getDate() + i)
  
      applicationTrends.push({
        date: currentDate.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 100) + 10,
      })
    }
  
    return {
      totalApplicants,
      totalApplicantsTrend,
      verifiedApplicants,
      verifiedApplicantsTrend,
      rejectedApplicants,
      rejectedApplicantsTrend,
      applicationsByProgram,
      applicationTrends,
    }
  }
  
  // Mock API function
  export async function fetchAdmissionAnalytics(params: AdmissionAnalyticsParams): Promise<AdmissionAnalytics> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    return generateMockData(params.from, params.to)
  }
  