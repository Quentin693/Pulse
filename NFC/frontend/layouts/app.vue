<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <div class="container-pulse flex-1 flex gap-6 py-6">
      <AppSidebar />
      <div class="flex-1 min-w-0">
        <slot />
      </div>
    </div>
    <SiteFooter />
  </div>
</template>
