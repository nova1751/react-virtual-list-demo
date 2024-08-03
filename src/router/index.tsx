/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Router } from '@remix-run/router'

const VirtualListDemo1 = lazy(() => import('@/views/virtual-list-demo-1'))

const router: Router = createBrowserRouter([{ path: '/', element: <VirtualListDemo1 /> }])

export default router
