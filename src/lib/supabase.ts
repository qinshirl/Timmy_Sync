// src/lib/supabase.ts
// import { createClient } from "@supabase/supabase-js"

// const supabaseUrl = process.env.SUPABASE_URL!
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

// // export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//     realtime: {
//       params: {
//         eventsPerSecond: 10,
//       },
//     },
//   })


// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})