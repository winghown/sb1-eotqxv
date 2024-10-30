<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const taskId = route.params.taskId as string

const task = ref<any>(null)
const comment = ref('')
const loading = ref(false)

const fetchTask = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/tasks/${taskId}`)
    task.value = response.data
  } catch (error) {
    ElMessage.error('获取任务信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleApprove = async (approved: boolean) => {
  try {
    await axios.post(`/api/tasks/${taskId}/complete`, {
      approved,
      comment: comment.value
    })
    ElMessage.success('处理成功')
    router.push('/tasks')
  } catch (error) {
    ElMessage.error('处理失败')
    console.error(error)
  }
}

onMounted(() => {
  fetchTask()
})
</script>

<template>
  <div class="process-approval" v-loading="loading">
    <div class="approval-form" v-if="task">
      <h2>任务审批</h2>
      
      <el-descriptions :column="1" border>
        <el-descriptions-item label="流程名称">
          {{ task.processName }}
        </el-descriptions-item>
        <el-descriptions-item label="任务名称">
          {{ task.taskName }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人">
          {{ task.initiator }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ task.createTime }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="form-content">
        <el-form label-position="top">
          <el-form-item label="审批意见">
            <el-input
              v-model="comment"
              type="textarea"
              rows="4"
              placeholder="请输入审批意见"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="actions">
        <el-button type="primary" @click="handleApprove(true)">同意</el-button>
        <el-button type="danger" @click="handleApprove(false)">拒绝</el-button>
        <el-button @click="router.push('/tasks')">取消</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.process-approval {
  padding: 20px;
}

.approval-form {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-content {
  margin: 24px 0;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
</style>