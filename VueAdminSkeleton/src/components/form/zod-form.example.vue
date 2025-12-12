<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" />
    </el-form-item>
    
    <el-form-item label="密码" prop="password">
      <el-input v-model="formData.password" type="password" />
    </el-form-item>
    
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="formData.email" />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { createUserSchema } from '@skeleton/shared-types'
import { validateFormErrors } from '@/utils/zod-validator'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const formData = reactive({
  username: '',
  password: '',
  email: ''
})

const formRules = {
  // Element Plus 表单规则（可选，Zod 验证会在提交时执行）
}

const handleSubmit = async () => {
  // 使用 Zod Schema 验证表单数据
  const errors = validateFormErrors(createUserSchema, formData)
  
  if (errors) {
    // 显示验证错误
    Object.keys(errors).forEach(field => {
      ElMessage.error(`${field}: ${errors[field]}`)
    })
    return
  }
  
  // 验证通过，提交表单
  try {
    // 调用 API
    // await createUser(formData)
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  }
}
</script>
