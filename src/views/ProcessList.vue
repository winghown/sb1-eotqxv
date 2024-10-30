<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProcessStore } from '../stores/process'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const processStore = useProcessStore()

onMounted(() => {
  loadProcesses()
})

const loadProcesses = async () => {
  try {
    await processStore.fetchProcesses()
  } catch (error) {
    ElMessage.error('加载流程列表失败')
  }
}

const handleEdit = (id: string) => {
  router.push(`/processes/${id}/edit`)
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个流程吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await processStore.deleteProcess(id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const createNewProcess = () => {
  router.push('/processes/new')
}
</script>

<template>
  <div class="process-list">
    <div class="header">
      <h2>流程管理</h2>
      <el-button type="primary" @click="createNewProcess">新建流程</el-button>
    </div>

    <el-table 
      v-loading="processStore.loading"
      :data="processStore.processes"
      style="width: 100%">
      <el-table-column prop="name" label="流程名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" @click="handleEdit(row.id)">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row.id)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.process-list {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}
</style>