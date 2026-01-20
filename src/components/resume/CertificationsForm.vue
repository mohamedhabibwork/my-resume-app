<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import type { Certification } from '@/types'
import { generateId } from '@/utils/helpers'

const props = defineProps<{
  certifications: Certification[]
}>()

const emit = defineEmits<{
  update: [data: Certification[]]
}>()

const { t } = useI18n()

const localData = ref<Certification[]>([...props.certifications])

function addCertification() {
  localData.value.push({
    id: generateId(),
    name: '',
    issuer: '',
    issueDate: '',
  })
  emit('update', localData.value)
}

function removeCertification(index: number) {
  localData.value.splice(index, 1)
  emit('update', localData.value)
}

function updateCertification(index: number, field: keyof Certification, value: unknown) {
  const cert = localData.value[index]
  if (cert) {
    localData.value[index] = { ...cert, [field]: value } as Certification
    emit('update', localData.value)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="(cert, index) in localData"
      :key="cert.id"
      class="border border-gray-200 rounded-lg p-4 space-y-4"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          Certification {{ index + 1 }}
        </h3>
        <Button
          variant="danger"
          size="sm"
          @click="removeCertification(index)"
        >
          Remove
        </Button>
      </div>

      <Input
        :model-value="cert.name"
        :label="t('resume.certifications.name')"
        required
        @update:model-value="updateCertification(index, 'name', $event)"
      />

      <Input
        :model-value="cert.issuer"
        :label="t('resume.certifications.issuer')"
        required
        @update:model-value="updateCertification(index, 'issuer', $event)"
      />

      <Input
        :model-value="cert.issueDate"
        type="date"
        :label="t('resume.certifications.issueDate')"
        @update:model-value="updateCertification(index, 'issueDate', $event)"
      />

      <Input
        :model-value="cert.expiryDate"
        type="date"
        :label="t('resume.certifications.expiryDate')"
        @update:model-value="updateCertification(index, 'expiryDate', $event)"
      />

      <Input
        :model-value="cert.credentialId"
        :label="t('resume.certifications.credentialId')"
        @update:model-value="updateCertification(index, 'credentialId', $event)"
      />

      <Input
        :model-value="cert.url"
        type="url"
        :label="t('resume.certifications.url')"
        @update:model-value="updateCertification(index, 'url', $event)"
      />
    </div>

    <Button
      variant="outline"
      @click="addCertification"
    >
      {{ t('resume.certifications.addNew') }}
    </Button>
  </div>
</template>
