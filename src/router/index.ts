import { createRouter, createWebHistory } from 'vue-router'
import ProcessList from '../views/ProcessList.vue'
import ProcessDesigner from '../views/ProcessDesigner.vue'
import TaskList from '../views/TaskList.vue'
import ProcessApproval from '../views/ProcessApproval.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/processes'
    },
    {
      path: '/processes',
      component: ProcessList
    },
    {
      path: '/processes/new',
      component: ProcessDesigner
    },
    {
      path: '/processes/:id/edit',
      component: ProcessDesigner
    },
    {
      path: '/tasks',
      component: TaskList
    },
    {
      path: '/approval/:taskId',
      component: ProcessApproval
    }
  ]
})

export default router