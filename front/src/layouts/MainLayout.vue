<template>
  <div id="app" class="min-h-screen flex">
    <!-- Sidebar (Fixed) -->
    <aside class="fixed top-0 left-0 w-[280px] h-screen flex flex-col bg-slate-900">
      <nav class="flex-1 flex flex-col items-center gap-5 p-4">
        <!-- Profile Section -->
        <div class="basis-1/4 content-center py-4">
          <div class="flex items-center gap-4">
            <img
              src="https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160705616/59613224-el-doctor-avatar-perfil-aisl%C3%B3-el-icono-gr%C3%A1fico-del-ejemplo-del-vector.jpg"
              alt="Profile picture"
              class="rounded-full size-20 hover:scale-105 transition duration-200"
            />
            <div class="gap-4 text-center">
              <h2 class="text-zinc-100 font-bold text-lg">Juanito Pérez</h2>
              <p class="text-zinc-400">Panel médico</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="flex-1 py-4">
          <ul class="flex flex-col gap-5">
            <li>
              <router-link
                to="/"
                class="flex items-center gap-3 px-4 py-2 text-zinc-100 hover:bg-slate-800 rounded-md transition"
              >
                <HomeIcon class="w-7 h-7 text-zinc-400" />
                Home
              </router-link>
            </li>
            <li>
              <router-link
                to="/medical-history"
                class="flex items-center gap-3 px-4 py-2 text-zinc-100 hover:bg-slate-800 rounded-md transition"
              >
                <ClipboardDocumentListIcon class="w-7 h-7 text-zinc-400" />
                Medical History
              </router-link>
            </li>
            <li>
              <router-link
                to="/charts"
                class="flex items-center gap-3 px-4 py-2 text-zinc-100 hover:bg-slate-800 rounded-md transition"
              >
                <ChartBarIcon class="w-7 h-7 text-zinc-400" />
                Charts
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Logout Button -->
        <div class="basis-1/12 content-center">
          <BaseButton
            className="bg-slate-700 text-zinc-100 hover:bg-slate-600 w-full"
            title="Logout"
            type="button"
          />
        </div>
      </nav>
    </aside>

    <!-- Right Content (scrollable) -->
    <div class="ml-[280px] flex-1 flex flex-col min-h-screen">
      <!-- Header -->
      <header class="bg-slate-300 sticky top-0 z-10">
        <nav class="flex justify-between items-center px-2 py-2">
          <ul>
            <li class="flex items-center gap-3 px-4 py-2 hover:bg-slate-400/50 rounded-md transition cursor-pointer">
              <ArrowLeftOnRectangleIcon class="text-slate-700 w-7 h-7" />
            </li>
          </ul>

          <ul class="flex gap-3">
            <li class="flex items-center gap-3 px-2 py-2 hover:bg-slate-400/50 rounded-md transition cursor-pointer">
              <img
                src="https://previews.123rf.com/images/yupiramos/yupiramos1607/yupiramos160705616/59613224-el-doctor-avatar-perfil-aisl%C3%B3-el-icono-gr%C3%A1fico-del-ejemplo-del-vector.jpg"
                alt="Profile picture"
                class="rounded-full w-9 h-9"
              />
            </li>
            <li class="flex items-center gap-3 px-2 py-2 hover:bg-slate-400/50 rounded-md transition cursor-pointer">
              <ArrowRightOnRectangleIcon class="w-7 h-7 text-slate-800" />
            </li>
          </ul>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="flex-1 bg-white flex flex-col items-center py-6">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="h-[80px] bg-slate-400"></footer>
    </div>
  </div>
</template>

<script setup>
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
