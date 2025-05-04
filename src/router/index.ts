import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/Login.vue'
import { useAuthStore } from '@/stores/auth'
import Signup from '@/components/Signup.vue'
import TrainerDashboard from '@/components/TrainerDashboard.vue'
import ClientDashboard from '@/components/ClientDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
       meta: { requiresGuest: true } // Redirect if already logged in
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
       meta: { requiresGuest: true } // Redirect if already logged in
    },
    {
      path: '/trainer',
      name: 'trainer',
      component: TrainerDashboard,
      meta: { requiresAuth: true, role: 'trainer' }, // Requires auth and trainer role
    },
    {
      path: '/client',
      name: 'client',
      component: ClientDashboard,
      meta: { requiresAuth: true, role: 'client' }, // Requires auth and client role
    },
     // Catch-all or 404 page (optional)
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  ],
})

router.beforeEach(async (to, from, next) => { // Make the guard async
  const authStore = useAuthStore()

  // Initialize store state by checking persisted login ONLY if not already initialized
  // This check might be redundant if App.vue's onMounted handles it reliably
  //  if (!authStore.isLoggedIn && localStorage.getItem('token')) {
  //    await authStore.checkPersistedLogin(); // Wait for check to complete
  //  }


  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiredRole = to.meta.role as 'client' | 'trainer' | undefined

  if (requiresAuth && !authStore.isLoggedIn) {
    // Redirect to login if trying to access a protected route without being logged in    
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  } else if (requiresAuth && requiredRole && authStore.user?.role !== requiredRole && to.path !== (authStore.user?.role === 'client' ? '/client' : '/trainer'))
  {
     // Redirect if logged in user tries to access a route for a different role
     // Redirect to their own dashboard or home
     console.log(`Redirecting to the correct dashboard- requires role ${requiredRole}, user has role ${authStore.user?.role}, to path: ${to.path}`);
     next(authStore.user?.role === 'client' ? '/client' : '/trainer')
  }
  else if (requiresGuest && authStore.isLoggedIn && to.path !== (authStore.user?.role === 'client' ? '/client' : '/trainer')) {
      // Redirect logged-in users away from login/signup pages, unless they are already in their dashboard
     next(authStore.user?.role === 'client' ? '/client' : '/trainer')
  } else if (requiresGuest && authStore.isLoggedIn) {
     // Redirect logged-in users away from login/signup pages
      console.log('Redirecting away from guest route - already logged in');
     next(authStore.user?.role === 'client' ? '/client' : '/trainer') // Redirect to appropriate dashboard
  }
  else {
    // Otherwise, allow navigation
    next()
  }
})

export default router
