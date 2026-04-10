---
layout: doc
title: 
outline: deep 
---


<script setup>
import { NAV_DATA } from '../../.vitepress/theme/utils/data.ts';
import Typewriter from '../../components/Typewriter.vue' ;
import MNavLinks from '../../components/MNavLinks.vue' 
</script>

<div class="nav-container">
  <Typewriter text="开发者的梦中情栈" :delay="200" type="neon" loop />
  <MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>
</div>

