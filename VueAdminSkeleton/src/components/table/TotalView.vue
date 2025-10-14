<template>
    <el-button class="total-view" type="primary" plain>
      <span>
        {{ t('comp.table.total') }}
        <span class="total-text">{{ props.total }}</span>
        {{ t('comp.table.unit') }}
      </span>
      ,
      <span :class="exceedSelectionClass" v-if="props.selection">
        {{ t('comp.table.selected') }}
        <span class="total-text">{{ props.selectedCount }}</span>
        <span>
              /<span class="total-text">{{ props.selectionLimit }}</span>
        </span>
        {{ t('comp.table.unit') }}
      </span>
    </el-button>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    total: number
    selectionLimit?: number
    selection?: string
    selectedCount: number
}>()

const exceedSelectionClass = computed(() => {
    if (props.selectionLimit) {
        if (props.selectedCount > props.selectionLimit) {
            return 'exceed_selection'
        }
    }
    return ''
})
</script>

<style scoped>
.total-view {
  margin-right: 10px;
  white-space: nowrap;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-info-light-3);
  display: flex;
  align-items: center;
  user-select: text;
  cursor: default;

  .total-icon {
    color: var(--el-color-primary);
  }

  .total-text {
    color: var(--el-color-primary);
    font-weight: bold;
    margin: auto 5px;
  }
  .exceed_selection {
    .total-text {
      color: var(--el-color-danger);
    }
  }
}
</style>