<template>
    <div>
      <span 
        v-for="(char, index) in displayedText" 
        :key="index" 
        :class="charClass">
        {{ char }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  
  interface Props {
    text: string;
    delay: number;
    effectType?: 'default' | 'neon' | 'sparkle';
    loop?: boolean;
  }
  
  const props = defineProps<Props>();
  
  const displayedText = ref<string>('');
  let currentIndex = 0;
  
  const addCharacter = () => {
    if (currentIndex < props.text.length) {
      displayedText.value += props.text[currentIndex];
      currentIndex++;
      setTimeout(addCharacter, props.delay);
    } else if (props.loop) { // 文本打字完毕后，如果开启循环模式，则重新开始
      displayedText.value = '';
      currentIndex = 0;
      addCharacter();
    }
  };
  
  const charClass = () => {
    if (props.effectType === 'neon') {
      return 'neon-effect';
    } else if (props.effectType === 'sparkle') {
      return 'sparkle-effect';
    } else {
      return 'default-effect';
    }
  };
  
  onMounted(() => {
    addCharacter();
  });
  
  // 监听props变化，重新开始打字
  watch(() => props.text, () => {
    displayedText.value = '';
    currentIndex = 0;
    addCharacter();
  });
  
  watch(() => props.delay, () => {
    displayedText.value = '';
    currentIndex = 0;
    addCharacter();
  });
  
  // 监听循环模式变化，重新开始打字
  watch(() => props.loop, () => {
    displayedText.value = '';
    currentIndex = 0;
    addCharacter();
  });
  </script>
  
  <style scoped>
  .default-effect {
    color: black;
  }
  
  .neon-effect {
    color: cyan;
    text-shadow: 0 0 5px cyan, 0 0 10px cyan, 0 0 15px cyan, 0 0 20px cyan;
    animation: neon-blink 1.5s infinite;
  }
  
  .sparkle-effect {
    color: gold;
    animation: sparkle 1s infinite;
  }
  
  @keyframes neon-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes sparkle {
    0% { text-shadow: 0 0 5px gold; }
    25% { text-shadow: 0 0 10px gold, 0 0 15px gold; }
    50% { text-shadow: 0 0 5px gold, 0 0 10px gold, 0 0 15px gold, 0 0 20px gold; }
    75% { text-shadow: 0 0 10px gold, 0 0 15px gold; }
    100% { text-shadow: 0 0 5px gold; }
  }
  </style>
