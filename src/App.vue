<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
</script>

<template>
  <el-config-provider>
    <div class="app-container">
      <el-container>
        <el-header>
          <el-menu mode="horizontal" router>
            <el-menu-item index="/processes">流程管理</el-menu-item>
            <el-menu-item index="/tasks">任务列表</el-menu-item>
          </el-menu>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>
  </el-config-provider>
</template>

<style>
.app-container {
  height: 100vh;
  width: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  padding: 0;
  border-bottom: 1px solid #ddd;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>