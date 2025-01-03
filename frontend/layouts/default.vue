<template>
  <div>
    <header class="w-screen h-[84px] relative">
      <div class="w-full h-[84px] left-0 top-0 absolute bg-[#eb6d18]"></div>
      <NuxtLink to="/"
        class="left-[53px] top-[32px] absolute text-center text-white/70 text-base font-['Lexend']"
      >
        New
      </NuxtLink>
      <NuxtLink to="/old"
        class="left-[162px] top-[32px] absolute text-center text-white/70 text-base font-normal font-['Lexend']"
      >
        Old
      </NuxtLink>
    </header>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.router-link-active {
  @apply text-white font-semibold;
}
.router-link-active:hover {
  @apply text-white font-semibold;
}
</style>

<script setup></script>
