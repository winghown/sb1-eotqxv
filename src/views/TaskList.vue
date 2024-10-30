<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const tasks = ref([])
const loading = ref(false)

const fetchTasks = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/tasks')
    tasks.value = response.data
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  } finally {
    loading.value = false
  }
}

const handleApprove = async (taskId: string) => {
  router.push(`/approval/${taskId}`)
}

onMounted(() => {
  fetchTasks()
})
</script>

<template>
  <div class="task-list">
    <div class="header">
      <h2>待办任务</h2>
    </div>

    <el-table 
      v-loading="loading"
      :data="tasks"
      border
      style="width: 100%"
    >
      <el-table-column prop="processName" label="流程名称" />
      <el-table-column prop="taskName" label="任务名称" />
      <el-table-column prop="assignee" label="处理人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            link 
            @click="handleApprove(row.id)"
          >
            审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.task-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>