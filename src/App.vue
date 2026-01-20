<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
    <ToastContainer />
  </AppLayout>
</template>
