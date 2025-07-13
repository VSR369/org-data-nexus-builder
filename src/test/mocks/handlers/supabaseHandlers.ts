import { http, HttpResponse } from 'msw'

const SUPABASE_URL = 'https://cmtehutbazgfjoksmkly.supabase.co'

export const supabaseHandlers = [
  // Generic Supabase REST API handler
  http.get(`${SUPABASE_URL}/rest/v1/*`, () => {
    return HttpResponse.json([])
  }),

  http.post(`${SUPABASE_URL}/rest/v1/*`, () => {
    return HttpResponse.json({ success: true })
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/*`, () => {
    return HttpResponse.json({ success: true })
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/*`, () => {
    return HttpResponse.json({ success: true })
  }),

  // Auth handlers
  http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'authenticated'
    })
  }),

  // Storage handlers
  http.post(`${SUPABASE_URL}/storage/v1/object/*`, () => {
    return HttpResponse.json({
      Key: 'test-file.jpg',
      path: 'test-file.jpg'
    })
  }),
]