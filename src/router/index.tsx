/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Router } from '@remix-run/router'

const Home = lazy(() => import('@/views/home'))
const VirtualListDemo1 = lazy(() => import('@/views/virtual-list-demo-1'))
const VirtualListDemo2 = lazy(() => import('@/views/virtual-list-demo-2'))
const VirtualListDemo3 = lazy(() => import('@/views/virtual-list-demo-3'))
const VirtualListDemo4 = lazy(() => import('@/views/virtual-list-demo-4'))

const router: Router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/demo1', element: <VirtualListDemo1 /> },
  { path: '/demo2', element: <VirtualListDemo2 /> },
  { path: '/demo3', element: <VirtualListDemo3 /> },
  { path: '/demo4', element: <VirtualListDemo4 /> },
])

export default router
