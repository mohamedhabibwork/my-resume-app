<script setup lang="ts">
function retry() {
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-8">
    <div class="card bg-base-100 shadow-xl max-w-md">
      <div class="card-body items-center text-center">
        <div class="text-6xl mb-4">
          📡
        </div>
        <h1 class="card-title text-3xl mb-4">
          You're Offline
        </h1>
        <p class="text-base-content/70 mb-6">
          It looks like you're not connected to the internet. Please check your connection and try again.
        </p>
        <div class="card-actions">
          <button
            class="btn btn-primary"
            @click="retry"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
