<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProcessStore } from '../stores/process'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const processStore = useProcessStore()

const canvas = ref<HTMLElement | null>(null)
const processName = ref('')
const processDescription = ref('')
let modeler: any = null

onMounted(async () => {
  if (canvas.value) {
    modeler = new BpmnModeler({
      container: canvas.value,
      keyboard: {
        bindTo: window
      }
    })

    if (route.params.id) {
      await loadProcess(route.params.id as string)
    } else {
      await createNewDiagram()
    }
  }
})

const loadProcess = async (id: string) => {
  try {
    const response = await fetch(`/api/processes/${id}`)
    const process = await response.json()
    processName.value = process.name
    processDescription.value = process.description
    await modeler.importXML(process.xml)
    modeler.get('canvas').zoom('fit-viewport')
  } catch (err) {
    ElMessage.error('加载流程失败')
    console.error(err)
  }
}

const createNewDiagram = async () => {
  const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                    id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="Process_1" isExecutable="false">
      <bpmn:startEvent id="StartEvent_1"/>
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
          <dc:Bounds x="152" y="102" width="36" height="36"/>
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn:definitions>`

  try {
    await modeler.importXML(diagramXML)
    modeler.get('canvas').zoom('fit-viewport')
  } catch (err) {
    ElMessage.error('创建流程失败')
    console.error(err)
  }
}

const saveProcess = async () => {
  if (!processName.value) {
    ElMessage.warning('请输入流程名称')
    return
  }

  try {
    const { xml } = await modeler.saveXML({ format: true })
    const processData = {
      id: route.params.id,
      name: processName.value,
      description: processDescription.value,
      xml
    }
    
    await processStore.saveProcess(processData)
    ElMessage.success('保存成功')
    router.push('/processes')
  } catch (err) {
    ElMessage.error('保存失败')
    console.error(err)
  }
}
</script>

<template>
  <div class="process-designer">
    <div class="toolbar">
      <el-form :inline="true">
        <el-form-item label="流程名称">
          <el-input v-model="processName" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item label="流程描述">
          <el-input v-model="processDescription" placeholder="请输入流程描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveProcess">保存</el-button>
          <el-button @click="router.push('/processes')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<style scoped lang="scss">
.process-designer {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .toolbar {
    padding: 16px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .canvas {
    flex: 1;
    background-color: #fff;
  }
}
</style>