import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'

function App() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            textAlign: 'center',
            marginTop: 200
          }}
        >
          loading...
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
